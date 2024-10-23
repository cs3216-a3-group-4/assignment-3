from http import HTTPStatus
from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.auth.dependencies import get_current_user
from src.common.dependencies import get_session
from src.events.models import Analysis, Article, ArticleBookmark, ArticleConcept, Event
from src.events.schemas import ArticleDTO
from src.likes.models import Like
from src.notes.models import Note


def retrieve_article(
    id: int,
    user=Depends(get_current_user),
    session=Depends(get_session),
) -> ArticleDTO:
    article = session.scalar(
        select(Article)
        .where(Article.id == id)
        .options(
            selectinload(
                Article.categories,
            ),
            selectinload(Article.article_concepts).selectinload(ArticleConcept.concept),
            selectinload(Article.original_events)
            .selectinload(Event.analysises)
            .selectinload(
                Analysis.likes.and_(Like.point_id.is_(None)).and_(
                    Like.user_id == user.id
                )
            ),
            selectinload(Article.original_events)
            .selectinload(Event.analysises)
            .selectinload(Analysis.category),
            selectinload(Article.original_events)
            .selectinload(Event.analysises)
            .selectinload(Analysis.notes.and_(Note.user_id == user.id)),
            selectinload(Article.original_events).selectinload(
                Event.notes.and_(Note.user_id == user.id)
            ),
            selectinload(Article.notes.and_(Note.user_id == user.id)),
            selectinload(Article.bookmarks.and_(ArticleBookmark.user_id == user.id)),
        )
    )
    if not article:
        raise HTTPException(HTTPStatus.NOT_FOUND)

    return article
