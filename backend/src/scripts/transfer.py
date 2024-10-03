"""This script is used to sync staging articles/event/analysis"""

import argparse
from typing import Tuple

from sqlalchemy import Engine, create_engine, select
from sqlalchemy.orm import Session, make_transient
from src.events.models import Analysis, Article, Event


def get_engines() -> Tuple[Engine, Engine]:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-f", "--from-url", help="extract from this db url", required=True
    )
    parser.add_argument("-t", "--to-url", help="add to this db url", required=True)
    args = parser.parse_args()

    from_engine = create_engine(args.from_url)
    to_engine = create_engine(args.to_url)
    return from_engine, to_engine


def transfer_model(from_engine: Engine, to_engine: Engine, model_class):
    # Select id from to engine
    with Session(to_engine) as session:
        ids = session.scalars(select(model_class.id)).all()

    # Select models from from_engine where ids are not in to_engine
    with Session(from_engine) as session:
        models = session.scalars(
            select(model_class).where(model_class.id.not_in(ids))
        ).all()

    for model in models:
        make_transient(model)
        model.id = None

    # Add to to_engine
    with Session(to_engine) as session:
        if models:
            session.add_all(models)
            session.commit()
            print(f"Transferred {len(models)} {model_class}")
        else:
            print(f"No models to transfer for {model_class}")


def transfer():
    from_engine, to_engine = get_engines()

    transfer_model(from_engine, to_engine, Article)
    transfer_model(from_engine, to_engine, Event)
    transfer_model(from_engine, to_engine, Analysis)


if __name__ == "__main__":
    transfer()
