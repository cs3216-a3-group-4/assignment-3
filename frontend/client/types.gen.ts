// This file is auto-generated by @hey-api/openapi-ts

export type AnalysisNoteDTO = {
    id: number;
    content: string;
    start_index?: (number | null);
    end_index?: (number | null);
    parent_id: number;
    parent_type: NoteType;
    category?: (CategoryDTO | null);
    created_at: string;
    updated_at: string;
    analysis: AnalysisToEventDTO;
};

export type AnalysisToEventDTO = {
    id: number;
    category: CategoryDTO;
    content: string;
    likes: Array<LikeDTO>;
    event_id: number;
    event: BaseEventDTO;
};

export type AnswerDTO = {
    id: number;
    points: Array<PointDTO>;
};

export type AnswerMiniDTO = {
    id: number;
    points: Array<PointMiniDTO>;
};

export type ArticleDTO = {
    id: number;
    title: string;
    summary: string;
    url: string;
    source: ArticleSource;
    date: string;
    image_url: string;
};

export type ArticleSource = 'CNA' | 'GUARDIAN';

export type BaseEventDTO = {
    id: number;
    title: string;
    description: string;
    is_singapore: boolean;
    date: string;
    categories: Array<CategoryDTO>;
    original_article: ArticleDTO;
};

export type Body_log_in_auth_login_post = {
    grant_type?: (string | null);
    username: string;
    password: string;
    scope?: string;
    client_id?: (string | null);
    client_secret?: (string | null);
};

export type BookmarkDTO = {
    user_id: number;
};

export type CategoryDTO = {
    id: number;
    name: string;
};

export type CheckoutRequestData = {
    price_id: string;
    tier_id: number;
};

export type CommentAnalysisDTO = {
    skill_issue: string;
    analysis: AnalysisToEventDTO;
};

export type CommentDTO = {
    id: number;
    lack_example: boolean;
    inclination: Inclination;
    content: string;
    comment_analysises: Array<CommentAnalysisDTO>;
};

export type CreateUserQuestion = {
    question: string;
};

export type EssayCreate = {
    question: string;
    paragraphs: Array<ParagraphDTO_Input>;
};

export type EssayCreateDTO = {
    essay_id: number;
};

export type EssayDTO = {
    id: number;
    question: string;
    comments: Array<CommentDTO>;
    paragraphs: Array<ParagraphDTO_Output>;
};

export type EssayMiniDTO = {
    id: number;
    question: string;
};

export type EventDTO = {
    id: number;
    title: string;
    description: string;
    is_singapore: boolean;
    date: string;
    categories: Array<CategoryDTO>;
    original_article: ArticleDTO;
    reads: Array<ReadDTO>;
    analysises: Array<src__events__schemas__AnalysisDTO>;
    gp_questions: Array<GPQuestionDTO>;
    bookmarks: Array<BookmarkDTO>;
    notes: Array<NoteDTO>;
};

export type EventIndexResponse = {
    total_count: number;
    count: number;
    data: Array<MiniEventDTO>;
};

export type EventNoteDTO = {
    id: number;
    content: string;
    start_index?: (number | null);
    end_index?: (number | null);
    parent_id: number;
    parent_type: NoteType;
    category?: (CategoryDTO | null);
    created_at: string;
    updated_at: string;
    event: BaseEventDTO;
};

export type FallbackDTO = {
    alt_approach: string;
    general_argument: string;
};

export type GPQuestionDTO = {
    id: number;
    question: string;
    is_llm_generated: boolean;
    categories: Array<CategoryDTO>;
};

export type HTTPValidationError = {
    detail?: Array<ValidationError>;
};

export type Inclination = 'good' | 'neutral' | 'bad';

export type LikeDTO = {
    point_id?: (number | null);
    analysis_id?: (number | null);
    type: LikeType;
    user_id: number;
};

export type LikeData = {
    point_id?: (number | null);
    analysis_id?: (number | null);
    type: LikeType;
};

export type LikeType = 1 | -1;

export type MiniEventDTO = {
    id: number;
    title: string;
    description: string;
    is_singapore: boolean;
    date: string;
    categories: Array<CategoryDTO>;
    original_article: ArticleDTO;
    reads: Array<ReadDTO>;
};

export type NoteCreate = {
    content: string;
    start_index?: (number | null);
    end_index?: (number | null);
    parent_id: number;
    parent_type: NoteType;
    category_id?: (number | null);
};

export type NoteDTO = {
    id: number;
    content: string;
    start_index?: (number | null);
    end_index?: (number | null);
    parent_id: number;
    parent_type: NoteType;
    category?: (CategoryDTO | null);
    created_at: string;
    updated_at: string;
};

export type NoteType = 'event' | 'article' | 'point' | 'analysis';

export type NoteUpdate = {
    content: string;
    start_index?: (number | null);
    end_index?: (number | null);
    category_id?: (number | null);
};

export type ParagraphDTO_Input = {
    content: string;
    type: ParagraphType;
};

export type ParagraphDTO_Output = {
    content: string;
    type: string;
    comments: Array<CommentDTO>;
};

export type ParagraphType = 'introduction' | 'paragraph' | 'conclusion';

export type PasswordResetCompleteData = {
    password: string;
    confirm_password: string;
};

export type PasswordResetMoreCompleteData = {
    password: string;
    confirm_password: string;
    old_password: string;
};

export type PasswordResetRequestData = {
    email: string;
};

export type PointAnalysisDTO = {
    analysis: src__user_questions__schemas__AnalysisDTO;
    elaboration: string;
    point_id: number;
};

export type PointDTO = {
    id: number;
    title: string;
    body: string;
    positive: boolean;
    point_analysises: Array<PointAnalysisDTO>;
    fallback?: (FallbackDTO | null);
    likes: Array<LikeDTO>;
};

export type PointMiniDTO = {
    id: number;
    title: string;
    body: string;
    positive: boolean;
};

export type ProfileUpdate = {
    category_ids?: Array<(number)>;
    top_events_period?: number;
};

export type ReadDTO = {
    first_read: string;
    last_read: string;
};

export type SignUpData = {
    email: string;
    password: string;
};

export type SubscriptionDTO = {
    id: string;
    user_id: number;
    price_id: string;
    customer_id: string;
    subscription_period_end?: (string | null);
    subscription_ended_date?: (string | null);
    subscription_cancel_at?: (string | null);
    subscription_cancelled_date?: (string | null);
    status: SubscriptionStatusType;
    user?: (UserPublic | null);
};

export type SubscriptionStatusType = 'active' | 'cancelled' | 'paused' | 'past_due' | 'unpaid';

export type Token = {
    access_token: string;
    token_type: string;
    user: UserPublic;
};

export type UserPublic = {
    id: number;
    email: string;
    categories: Array<CategoryDTO>;
    top_events_period?: number;
    tier_id?: number;
};

export type UserQuestionDTO = {
    id: number;
    question: string;
    answer: AnswerDTO;
};

export type UserQuestionMiniDTO = {
    id: number;
    question: string;
    answer: AnswerMiniDTO;
};

export type ValidationError = {
    loc: Array<(string | number)>;
    msg: string;
    type: string;
};

export type ValidationResult = {
    is_valid: boolean;
    error_message: string;
};

export type src__events__schemas__AnalysisDTO = {
    id: number;
    category: CategoryDTO;
    content: string;
    likes: Array<LikeDTO>;
    event_id: number;
    notes: Array<NoteDTO>;
};

export type src__user_questions__schemas__AnalysisDTO = {
    id: number;
    content: string;
    event: MiniEventDTO;
    likes: Array<LikeDTO>;
};

export type SignUpAuthSignupPostData = {
    body: SignUpData;
};

export type SignUpAuthSignupPostResponse = (Token);

export type SignUpAuthSignupPostError = (HTTPValidationError);

export type LogInAuthLoginPostData = {
    body: Body_log_in_auth_login_post;
};

export type LogInAuthLoginPostResponse = (Token);

export type LogInAuthLoginPostError = (HTTPValidationError);

export type LoginGoogleAuthLoginGoogleGetResponse = (unknown);

export type LoginGoogleAuthLoginGoogleGetError = unknown;

export type AuthGoogleAuthGoogleGetData = {
    query: {
        code: string;
    };
};

export type AuthGoogleAuthGoogleGetResponse = (Token);

export type AuthGoogleAuthGoogleGetError = (HTTPValidationError);

export type GetUserAuthSessionGetData = unknown;

export type GetUserAuthSessionGetResponse = (UserPublic);

export type GetUserAuthSessionGetError = (HTTPValidationError);

export type LogoutAuthLogoutGetData = unknown;

export type LogoutAuthLogoutGetResponse = (unknown);

export type LogoutAuthLogoutGetError = (HTTPValidationError);

export type RequestPasswordResetAuthPasswordResetPostData = {
    body: PasswordResetRequestData;
};

export type RequestPasswordResetAuthPasswordResetPostResponse = (unknown);

export type RequestPasswordResetAuthPasswordResetPostError = (HTTPValidationError);

export type CompletePasswordResetAuthPasswordResetPutData = {
    body: PasswordResetCompleteData;
    query: {
        code: string;
    };
};

export type CompletePasswordResetAuthPasswordResetPutResponse = (unknown);

export type CompletePasswordResetAuthPasswordResetPutError = (HTTPValidationError);

export type ChangePasswordAuthChangePasswordPutData = {
    body: PasswordResetMoreCompleteData;
};

export type ChangePasswordAuthChangePasswordPutResponse = (unknown);

export type ChangePasswordAuthChangePasswordPutError = (HTTPValidationError);

export type CreateCheckoutSessionBillingCreateCheckoutSessionPostData = {
    body: CheckoutRequestData;
};

export type CreateCheckoutSessionBillingCreateCheckoutSessionPostResponse = (unknown);

export type CreateCheckoutSessionBillingCreateCheckoutSessionPostError = (HTTPValidationError);

export type StripeWebhookBillingWebhookPostData = {
    headers?: {
        'stripe-signature'?: string;
    };
};

export type StripeWebhookBillingWebhookPostResponse = (unknown);

export type StripeWebhookBillingWebhookPostError = (HTTPValidationError);

export type GetCategoriesCategoriesGetData = unknown;

export type GetCategoriesCategoriesGetResponse = (Array<CategoryDTO>);

export type GetCategoriesCategoriesGetError = (HTTPValidationError);

export type UpdateProfileProfilePutData = {
    body: ProfileUpdate;
};

export type UpdateProfileProfilePutResponse = (UserPublic);

export type UpdateProfileProfilePutError = (HTTPValidationError);

export type GetEventsEventsGetData = {
    query?: {
        bookmarks?: boolean;
        category_ids?: (Array<(number)> | null);
        end_date?: (string | null);
        limit?: (number | null);
        offset?: (number | null);
        singapore_only?: boolean;
        start_date?: (string | null);
    };
};

export type GetEventsEventsGetResponse = (EventIndexResponse);

export type GetEventsEventsGetError = (HTTPValidationError);

export type GetEventEventsIdGetData = {
    path: {
        id: number;
    };
};

export type GetEventEventsIdGetResponse = (EventDTO);

export type GetEventEventsIdGetError = (HTTPValidationError);

export type GetEventNotesEventsIdNotesGetData = {
    path: {
        id: number;
    };
};

export type GetEventNotesEventsIdNotesGetResponse = (Array<NoteDTO>);

export type GetEventNotesEventsIdNotesGetError = (HTTPValidationError);

export type ReadEventEventsIdReadPostData = {
    path: {
        id: number;
    };
};

export type ReadEventEventsIdReadPostResponse = (unknown);

export type ReadEventEventsIdReadPostError = (HTTPValidationError);

export type SearchWhateverEventsSearchGetData = {
    query: {
        query: string;
    };
};

export type SearchWhateverEventsSearchGetResponse = (unknown);

export type SearchWhateverEventsSearchGetError = (HTTPValidationError);

export type AddBookmarkEventsIdBookmarksPostData = {
    path: {
        id: number;
    };
};

export type AddBookmarkEventsIdBookmarksPostResponse = (unknown);

export type AddBookmarkEventsIdBookmarksPostError = (HTTPValidationError);

export type DeleteBookmarkEventsIdBookmarksDeleteData = {
    path: {
        id: number;
    };
};

export type DeleteBookmarkEventsIdBookmarksDeleteResponse = (unknown);

export type DeleteBookmarkEventsIdBookmarksDeleteError = (HTTPValidationError);

export type GetUserQuestionsUserQuestionsGetData = unknown;

export type GetUserQuestionsUserQuestionsGetResponse = (Array<UserQuestionMiniDTO>);

export type GetUserQuestionsUserQuestionsGetError = (HTTPValidationError);

export type CreateUserQuestionUserQuestionsPostData = {
    body: CreateUserQuestion;
};

export type CreateUserQuestionUserQuestionsPostResponse = ((UserQuestionDTO | ValidationResult));

export type CreateUserQuestionUserQuestionsPostError = (HTTPValidationError);

export type GetUserQuestionUserQuestionsIdGetData = {
    path: {
        id: number;
    };
};

export type GetUserQuestionUserQuestionsIdGetResponse = (UserQuestionDTO);

export type GetUserQuestionUserQuestionsIdGetError = (HTTPValidationError);

export type ClassifyQuestionUserQuestionsClassifyPostData = {
    query: {
        question: string;
    };
};

export type ClassifyQuestionUserQuestionsClassifyPostResponse = (unknown);

export type ClassifyQuestionUserQuestionsClassifyPostError = (HTTPValidationError);

export type GetAllNotesNotesGetData = {
    query?: {
        category_id?: (number | null);
    };
};

export type GetAllNotesNotesGetResponse = (Array<(EventNoteDTO | AnalysisNoteDTO)>);

export type GetAllNotesNotesGetError = (HTTPValidationError);

export type CreateNoteNotesPostData = {
    body: NoteCreate;
};

export type CreateNoteNotesPostResponse = (NoteDTO);

export type CreateNoteNotesPostError = (HTTPValidationError);

export type UpdateNoteNotesIdPutData = {
    body: NoteUpdate;
    path: {
        id: number;
    };
};

export type UpdateNoteNotesIdPutResponse = (NoteDTO);

export type UpdateNoteNotesIdPutError = (HTTPValidationError);

export type DeleteNoteNotesIdDeleteData = {
    path: {
        id: number;
    };
};

export type DeleteNoteNotesIdDeleteResponse = (unknown);

export type DeleteNoteNotesIdDeleteError = (HTTPValidationError);

export type GetPointNotesPointsIdNotesGetData = unknown;

export type GetPointNotesPointsIdNotesGetResponse = (unknown);

export type GetPointNotesPointsIdNotesGetError = (HTTPValidationError);

export type UpsertLikeLikesPostData = {
    body: LikeData;
};

export type UpsertLikeLikesPostResponse = (unknown);

export type UpsertLikeLikesPostError = (HTTPValidationError);

export type CreateEssayEssaysPostData = {
    body: EssayCreate;
};

export type CreateEssayEssaysPostResponse = (EssayCreateDTO);

export type CreateEssayEssaysPostError = (HTTPValidationError);

export type GetEssaysEssaysGetData = unknown;

export type GetEssaysEssaysGetResponse = (Array<EssayMiniDTO>);

export type GetEssaysEssaysGetError = (HTTPValidationError);

export type GetEssayEssaysIdGetData = {
    path: {
        id: number;
    };
};

export type GetEssayEssaysIdGetResponse = (EssayDTO);

export type GetEssayEssaysIdGetError = (HTTPValidationError);

export type GetSubscriptionSubscriptionsIdGetData = {
    path: {
        id: number;
    };
};

export type GetSubscriptionSubscriptionsIdGetResponse = (SubscriptionDTO);

export type GetSubscriptionSubscriptionsIdGetError = (HTTPValidationError);

export type GetSubscriptionStatusSubscriptionsIdStatusGetData = {
    path: {
        id: number;
    };
};

export type GetSubscriptionStatusSubscriptionsIdStatusGetResponse = (SubscriptionStatusType);

export type GetSubscriptionStatusSubscriptionsIdStatusGetError = (HTTPValidationError);