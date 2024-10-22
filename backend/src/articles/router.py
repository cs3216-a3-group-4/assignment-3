from datetime import datetime
from typing import Annotated
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from src.articles.dependencies import retrieve_article
from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.common.dependencies import get_session
from src.common.schemas import IndexResponse
from src.events.models import Article, Category, Event
from src.events.schemas import ArticleDTO, MiniArticleDTO


router = APIRouter(prefix="/articles", tags=["articles"])


@router.get("/")
def get_articles(
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[Session, Depends(get_session)],
    start_date: Annotated[datetime | None, Query()] = None,
    end_date: Annotated[datetime | None, Query()] = None,
    category_ids: Annotated[list[int] | None, Query()] = None,
    limit: int | None = None,
    offset: int | None = None,
    # TODO: implement bookmarks
    # bookmarks: bool = False,
    singapore_only: bool = False,
) -> IndexResponse[MiniArticleDTO]:
    query = select(Article.id).distinct()

    # TODO: uncomment this line after https://github.com/cs3216-a3-group-4/assignment-3/pull/252 merged
    # query = query.where(Article.useless == False)  # noqa: E712

    if start_date is not None:
        query = query.where(Article.date >= start_date)
    if end_date is not None:
        query = query.where(Article.date <= end_date)
    if singapore_only:
        query = query.where(Article.original_events.any(Event.is_singapore == True))  # noqa: E712
    if category_ids:
        query = query.join(
            Article.original_events.any(
                Event.categories.and_(Category.id.in_(category_ids))
            )
        )
    relevant_ids = [id for id in session.scalars(query)]

    total_count = len(relevant_ids)

    article_query = (
        select(Article)
        .options(selectinload(Article.categories))
        .where(Article.id.in_(relevant_ids))
    )
    if limit is not None:
        article_query = article_query.limit(limit)
    if offset is not None:
        offset = max(0, offset)
        article_query = article_query.offset(offset)

    article_query = article_query.order_by(Article.date.desc())

    articles = session.scalars(article_query).all()

    return IndexResponse[MiniArticleDTO](
        total_count=total_count, count=len(articles), data=articles
    )


@router.get("/{id}")
def get_article(article: Annotated[Article, Depends(retrieve_article)]) -> ArticleDTO:
    # TODO: query one article
    return article
