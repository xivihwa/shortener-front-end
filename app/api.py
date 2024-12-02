from datetime import datetime
import math
from typing import Annotated, NamedTuple
from fastapi import APIRouter, Body, Depends, HTTPException, Query, Response
from fastapi import status
from fastapi.security import OAuth2PasswordRequestForm

from .dependencies import get_auth_user
from .models import (
    CreateURLModel,
    CreateUserModel,
    Detailed,
    PageParams,
    Token,
    URLModel,
    UserModel,
)
from .logic import (
    authenticate_user,
    create_access_token,
    create_url,
    find_url,
    get_url_redirects,
    get_user_urls,
    is_username_available,
    create_user,
)

api = APIRouter()


class _Link(NamedTuple):
    url: str
    rel: str


def _links(links: list[_Link]) -> str:
    return ",".join([f'<{link.url}>; rel="{link.rel}"' for link in links])


@api.post(
    "/register",
    tags=["users"],
    status_code=status.HTTP_201_CREATED,
    description="Register new user. Forbidden for logged in users",
    responses={
        status.HTTP_409_CONFLICT: {
            "description": "Username already taken",
            "model": Detailed,
        },
    },
)
async def register(
    input: Annotated[CreateUserModel, Body()],
    response: Response,
) -> UserModel:
    if not is_username_available(input.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Username already taken"
        )
    user = create_user(input)
    response.headers["Link"] = _links(
        [
            _Link("/login", "login"),
        ]
    )
    return user


@api.post(
    "/login",
    tags=["users"],
)
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], response: Response
) -> Token:
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(user)
    response.headers["Link"] = _links([_Link("/api/users/me", "self")])
    return access_token


@api.get(
    "/me",
    tags=["users"],
    description="Returns the currently logged in user",
    responses={
        status.HTTP_401_UNAUTHORIZED: {
            "description": "Not logged in",
            "model": Detailed,
        }
    },
)
async def me(
    auth_user: Annotated[UserModel, Depends(get_auth_user)],
) -> UserModel:
    return auth_user


@api.get("/me/urls", tags=["urls"])
async def list_my_urls(
    auth_user: Annotated[UserModel, Depends(get_auth_user)],
    query: Annotated[PageParams, Query()],
    response: Response,
) -> list[URLModel]:
    urls = get_user_urls(auth_user, query.page)
    header_links = [
        _Link("/api/me/links?page=1", "first"),
        _Link(f"/api/me/links?page={max(1, math.ceil(auth_user.links / 10))}", "last"),
    ]
    if query.page > 1:
        header_links.append(_Link(f"/api/me/links?page={query.page - 1}", "prev"))
    if query.page < math.ceil(auth_user.links / 10):
        header_links.append(_Link(f"/api/me/links?page={query.page + 1}", "next"))
    response.headers["Link"] = _links(header_links)
    return urls


@api.get("/me/links/{short}/redirects", tags=["urls"])
async def get_link_redirects(
    auth_user: Annotated[UserModel, Depends(get_auth_user)],
    short: str,
) -> list[datetime]:
    url = find_url(short=short)
    if url is None or url.owner.lower() != auth_user.username.lower():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    redirects = get_url_redirects(url)
    return redirects


@api.post("/me/urls", tags=["urls"])
async def shorten_url(
    auth_user: Annotated[UserModel, Depends(get_auth_user)],
    input: Annotated[CreateURLModel, Body()],
) -> URLModel:
    return create_url(input, auth_user)
