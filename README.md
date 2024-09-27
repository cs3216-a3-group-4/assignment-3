# Jippy

![jippy](frontend/public/og.png)

https://jippy.site

Jippy is an AI-powered companion for students aiming to excel in their GCE A-Level General Paper essays. Our platform offers curated weekly articles, providing insights on how current global events can be leveraged as examples in essays.

## Team Members

| Name              | Matric Number | Github     | Contributions                |
| ----------------- | ------------- | ---------- | ---------------------------- |
| Chloe Lim Xinying | A0238609W     | @chloeelim | Frontend + Branding + UI/UX  |
| Kyal Sin Min Thet | A0258874J     | @marcus-ny | Prompt Engineering + Backend |
| Leong See Leng    | A0239616X     | @seelengxd | Full stack + Web scraping    |
| Wang Haoyang      | A0234534J     | @haoyangw  | Frontend                     |

## Setup instructions

1. Clone the repo
2. Install uv
3. Set up postgres
4. cd to backend
5. uv run alembic upgrade head
6. uv sync
7. uv run fastapi run ./src/app.py
8. cd to frontend
9. npm i
10. npm run dev

## Resources

- Tailwindcss docs
- Next.js docs
- SQLAlchemy docs
- Langchain documents
- OpenAI API
- Pinecone