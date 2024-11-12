# this is just to load models in alembic

from src.auth import models as auth_models  # noqa: F401
from src.events import models as event_models  # noqa: F401
from src.user_questions import models as user_question_models  # noqa: F401
from src.notes import models as note_models  # noqa: F401
from src.likes import models as like_models  # noqa: F401
from src.limits import models as limit_models  # noqa: F401
from src.essays import models as essay_models  # noqa: F401
from src.subscriptions import models as subscription_models  # noqa: F401
from src.billing import models as billing_models  # noqa: F401
from src.daily_practice import models as daily_practice_models  # noqa: F401
