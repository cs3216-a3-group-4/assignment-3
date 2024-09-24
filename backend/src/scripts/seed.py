from datetime import datetime
from sqlalchemy import select
from src.events.models import (
    Analysis,
    Article,
    ArticleSource,
    Category,
    Event,
    GPQuestion,
)
from sqlalchemy.orm import Session
from src.common.database import engine


def add_categories():
    CATEGORIES = [
        "Arts & Humanities",
        "Science & Technology",
        "Politics",
        "Media",
        "Environment",
        "Education",
        "Sports",
        "Gender & Equality",
        "Religion",
        "Society & Culture",
        "Economics",
    ]
    categories = [Category(name=category_name) for category_name in CATEGORIES]
    with Session(engine) as session:
        # If categories are already added, return
        if session.scalars(select(Category)).first() is not None:
            return
        session.add_all(categories)
        session.commit()


add_categories()


def test_associations():
    with Session(engine) as session:
        article = Article(
            title="test article",
            summary="test summary",
            url="https://whatever.com",
            source=ArticleSource.CNA,
            body="test body",
            date="2024-02-05",
            image_url="",
        )
        event = Event(
            title="test event 1",
            description="x",
            duplicate=False,
            date=datetime.now(),
            is_singapore=False,
            rating=5,
        )

        analysis = Analysis(category_id=1, content="hello")
        event.analysises.append(analysis)
        event.gp_questions.append(
            GPQuestion(question="whatever", is_llm_generated=False)
        )

        article.original_events.append(event)
        session.add(article)
        session.add(event)
        session.commit()

        session.refresh(article)
        session.refresh(event)
        print(article)
        print(event)
        event_id = event.id

    with Session(engine) as session:
        event_again = session.scalar(select(Event).where(Event.id == event_id))
        # categories = session.scalars(
        #     select(Category).where(Category.name.in_(["Environment", "Media"]))
        # )
        # event_again.categories.extend(categories)
        session.add(event_again)
        session.commit()

    with Session(engine) as session:
        event_again = session.scalar(select(Event).where(Event.id == event_id))
        print(event_again)
        print(event_again.original_article)
        print(event_again.categories)
        event_again.categories.clear()
        # original_article = event_again.original_article
        session.add(event_again)
        session.commit()
        # session.delete(event_again)
        # session.delete(original_article)


test_associations()


def put_sample_events():
    """
    {
        'event_title': 'Controversial Red Card Decision in Premier League Match',
        'description': 'Leandro Trossard was sent off for kicking the ball away after receiving a yellow card, raising questions about the consistency of refereeing decisions.',
        'category': ['Sports', 'Politics'],
        'analysis_list': [{
            'category': 'Sports', 'analysis': "This example can be used to discuss the role of referees in sports and how their decisions can significantly influence the outcome of a game. The controversy surrounding Trossard's red card highlights the debate about whether refereeing decisions are applied inconsistently, which can affect teams' performances and strategies during critical matches."
        }, {
            'category': 'Politics', 'analysis': "The incident reflects broader societal issues regarding authority and accountability, as it showcases how officials' decisions can lead to public outcry and scrutiny. It can be related to discussions on governance and the importance of transparency and fairness in decision-making processes."
        }],
        'in_singapore': False,
        'rating': 4
    }
    """
    """
    [
    EventPublic(
        id=0, 
        title="Declan Rice's Controversial Red Card", 
        description='The sending off of Declan Rice during the match against Brighton is a critical moment that highlights the inconsistencies in officiating in football.', 
        analysis_list=[
            CategoryAnalysis(category='Sports', analysis="This event can be used to discuss the impact of refereeing decisions on the outcome of football matches, particularly in high-stakes games. It raises questions about the fairness and consistency of officiating in professional sports and how it affects teams' performances and standings."), 
            CategoryAnalysis(category='Society & Culture', analysis='The controversy surrounding the red card reflects broader societal discussions about authority, accountability, and the interpretation of rules. It can be linked to the societal expectations of fairness in competitive environments and how cultural perceptions of justice influence reactions to such events.')
        ], 
        duplicate=False, 
        date='', 
        is_singapore=False, 
        original_article_id=0, 
        categories=['Sports', 'Society & Culture']
    ), 
    EventPublic(
        id=0, 
        title="Arsenal's Adaptation to Playing with 10 Men", 
        description="Arsenal's tactical adjustments after Rice's red card demonstrate the team's resilience and strategic depth.", 
        analysis_list=[
            CategoryAnalysis(category='Sports', analysis='This event can illustrate how teams must adapt to unexpected challenges during matches, showcasing tactical flexibility and mental fortitude. It highlights the importance of depth in squad management and coaching strategies in overcoming adversity during competitive sports.')], 
        duplicate=False, 
        date='', 
        is_singapore=False, 
        original_article_id=0, 
        categories=['Sports']
    )
    ]
    """
    with Session(engine) as session:
        article = Article(
            title="Why 10-man Arsenal’s rearguard action was a spectacle we did want to see",
            summary="Arsenal's tactical adjustments after Rice's red card demonstrate the team's resilience and strategic depth.",
            url="https://www.theguardian.com/football/2024/sep/23/football-daily-manchester-city-arsenal-spectacle",
            source=ArticleSource.GUARDIAN,
            body="""If Michael Oliver had brandished a red card in the fizzog of a Manchester City player who had just blindsided a stationary opponent with a fairly violent shoulder charge and then kicked the ball away in frustration upon being penalised for it just before half-time at the Etihad Stadium yesterday, Football Daily is fairly certain various Arsenal fans of our acquaintance would have had no problem whatsoever with his decision. In fact we know for a fact they would be absolutely delighted with it and rubbing their hands together with glee at the prospect of seeing their side play half the game with a one-goal lead and an extra player in their ranks.

Sadly, because this perceived injustice was visited upon one of their own, assorted Gunners supporters chose instead to bleat pompously about how the referee had “ruined the game as a spectacle”, apparently oblivious to the fact that Leandro’s Trossard’s dismissal had been a major contributory factor to the spectacle in question; one which was rendered no less compelling or entertaining by the Belgian’s absence. In unilaterally deciding on everybody else’s behalf that Oliver had ruined the game, what Arsenal fans in the media, on social media disgraces or in Football Daily’s local drinker actually meant is that the referee had ruined it as a spectacle for them.

After the game Mikel Arteta got in on the action with his quietly seething, passive aggressive rumination on the injustice of it all when he incorrectly stated that Trossard’s dismissal had turned the game into one “nobody wants to see”. While Football Daily can’t speak for everyone, we can’t have been the only viewers without a dog in the fight to be thoroughly entertained by the sight of Arsenal’s depleted side mounting a rearguard action so stout, well organised and heroic that it reduced one of the best sides on the planet to such a state of comical bewilderment that you could see Manchester City’s players openly pining for an absent Belgian of their own.

Reduced to taking a series of long-range surface-to-air potshots before sending on a big defender to play up front in the hope he might scramble home a goal, City finally equalised in time added on to added time, in the process pouring more fuel on the already roaring flames of The Big Conspiracy fire. With the points shared, assorted pundits across various networks were asked which side they thought would be happiest with the outcome and it was disappointing that not one of these assembled experts had the presence of mind to say “Liverpool” by way of reply.""",
            date="2024-09-23T14:46:00Z",
            image_url="https://i.guim.co.uk/img/media/b837477975566d119ae8944a7a149ede4f4c4682/0_87_3278_1966/master/3278.jpg?width=480&dpr=1&s=none",
        )
        event = Event(
            title="Arsenal's Adaptation to Playing with 10 Men",
            description="Arsenal's tactical adjustments after Rice's red card demonstrate the team's resilience and strategic depth.",
            duplicate=False,
            date="2024-09-23",
            is_singapore=False,
            rating=4,
        )

        analysis = Analysis(
            category_id=7,
            content="This event can illustrate how teams must adapt to unexpected challenges during matches, showcasing tactical flexibility and mental fortitude. It highlights the importance of depth in squad management and coaching strategies in overcoming adversity during competitive sports.",
        )
        event.analysises.append(analysis)
        event.gp_questions.append(
            GPQuestion(
                question="To what extent can resilience and strategic depth be cultivated through sports?",
                is_llm_generated=False,
            )
        )

        article.original_events.append(event)
        session.add(article)
        session.add(event)

        article2 = Article(
            title="Google Pixel 9 review: a good phone overshadowed by great ones",
            summary="The Google Pixel 9 is a good phone with solid features, but it is overshadowed by both the more affordable Pixel 8a and the more advanced Pixel 9 Pro, making it less appealing unless purchased at a discount.",
            url="https://www.theguardian.com/technology/2024/sep/19/google-pixel-9-review-a-good-phone-overshadowed-by-great-ones",
            source=ArticleSource.GUARDIAN,
            body="""Google’s cheapest Pixel 9 offers almost everything that makes its top-flight sibling one of the best smaller phones available, cutting a few key ingredients to price match Apple and Samsung.

The Pixel 9 costs £799 (€899/$799/A$1,349) shaving £200 off the asking price of the stellar Pixel 9 Pro while sitting above the excellent value sub-£500 Pixel 8a from May. That pits the new Pixel directly against Apple’s new iPhone 16 and Samsung’s Galaxy S24.

The Pixel 9 is identical in size and shape to the 9 Pro with matt aluminium sides and glass front and back. It has the same bold camera design on the back and a similar good-looking 6.3in OLED screen on the front. The display is not quite as sharp or bright as the 9 Pro, but the difference is minor.

Inside it has the same Tensor G4 chip with at least 128GB of storage, but less RAM with only 12GB not the 16GB of its more expensive sibling. In day-to-day usage the different is not noticeable and does not hold the Pixel 9 back in apps or AI for now.

The battery lasts about two days between charges, which is very good for a phone of this size. It fully charges in just over 80 minutes using a 27W or greater USB-C charger, though one is not included in the box.

Android 14 with most of Google’s AI
The home screen of the Pixel 9
View image in fullscreen
Gemini, Pixel Studio and the Screenshots app are all available. Photograph: Samuel Gibbs/The Guardian
The Pixel ships with Android 14 and seven years of software support including an upgrade to Android 15 in the autumn, making it one of the longest-lasting phones on the market.

Like its pricier siblings, the Pixel 9 runs Google’s latest Gemini Nano AI models. It has Google’s new Screenshots app, which collects your caps and makes them searchable rather than cluttering up your gallery. The Pixel Studio app quickly generates images via text prompts with a range of styles and lets you edit them. Google’s most advanced AI editing features in Photos can automatically reframe an image using generative AI or “reimagine” it to fully recast a photo or insert objects using text prompts.

But unlike the Pixel 9 Pro phones, it does not come with a bundled year of Google’s £19 a month Gemini Advanced subscription that is required to access the impressive new Gemini Live fully conversational AI assistant experience. It still has free access to the standard Gemini assistant for text and one-way requests, and you can take out the subscription at extra cost, though it may not be worth it at the moment.

Specifications
Screen: 6.3in 120Hz FHD+ OLED (422ppi)

Processor: Google Tensor G4

RAM: 12GB

Storage: 128 or 256GB

Operating system: Android 14

Camera: 50MP + 48MP ultrawide, 10.5MP selfie

Connectivity: 5G, eSIM, wifi 7, UWB, NFC, Bluetooth 5.3 and GNSS

Water resistance: IP68 (1.5m for 30 minutes)

Dimensions: 152.8 x 72.0 x 8.5mm

Weight: 198g

Camera
The camera app on a Google Pixel 9.
View image in fullscreen
The camera app has several fun and useful features from previous Pixels, including long exposure and action pan modes, Best Take and various photo editing tools. Photograph: Samuel Gibbs/The Guardian
The Pixel 9 has the same 50-megapixel main and 48MP ultrawide cameras as the Pixel 9 Pro, but lacks a telephoto zoom camera and some of the high-end features, including zoom enhance, full resolution capture and pro controls.

Photos from the main camera, in particular, are great across a range of lighting conditions. The ultrawide is pretty good too, and has a fun macrophotography feature for closeup shots. The main camera can zoom in on the sensor for a 2x magnification, but relies on digital zoom to go further, which can produce good results in bright light up to 8x. The 10.5MP selfie camera is a step down from the more powerful sensor on the 9 Pro, but still captures nice, detailed images.

The new Add Me feature inserts photographers into group shots by merging two photos taken back to back. An augmented reality overlay shows where the original photographer needs to position themselves to be added to the shot. It can trip up on certain objects in the scene, such as the occasional legs being blended into table tops, but can produce good images with a bit of practice.

The camera is still one of the best on a phone, but the lack of a telephoto camera really holds it back.

Sustainability
The camera module on the back of the Google Pixel 9.
View image in fullscreen
The camera lump on the back, made from recycled aluminium, certainly stands out in a crowd. The pale green colour looks better in the flesh than photos. Photograph: Samuel Gibbs/The Guardian
Google does not provide an expected lifespan for the battery but it should last in excess of 500 full charge cycles with at least 80% of its original capacity. The phone is repairable by Google and third-party shops, with published repair manuals and genuine replacement parts to be available from iFixit.

The Pixel 9 Pro is made with at least 20% recycled materials, including recycled aluminium, plastic, rare earth elements and tin. The company breaks down the phone’s environmental impact in its report. Google will recycle old devices free of charge.

Price
The Google Pixel 9 costs £799 (€899/$799/A$1,349).

For comparison, the Pixel 8a costs £419, Pixel 9 Pro costs £999, the Pixel 9 Pro XL costs £1,099, the Samsung Galaxy S24 costs £799 and the Apple iPhone 16 costs £799.

Verdict
The Pixel 9 is undoubtedly the best non-Pro flagship phone Google has made. It has a good balance of premium looks and features, shaving a bit off the cost of its top-tier phone of the same size.

The problem is that without a telephoto camera and the best AI features, which are limited to the more expensive 9 Pro series, the standard Pixel 9 is just a bit too close to the much better value Pixel 8a in features and capabilities.

That leaves it in a difficult spot. If the £999 Pixel 9 Pro blows the budget, then £800 for the Pixel 9 is still a lot to spend when you can get 80% of the experience for just over half the cost with a £419 Pixel 8a.

The Pixel 9 is therefore a good phone that is overshadowed by better Google phones at both ends of the spectrum. I would wait for a sale to make the price more tempting.

Pros: seven years of software updates, great camera, good screen, good battery life, good size, recycled aluminium, impressive local and generative AI features, fast fingerprint and face recognition.

Cons: no zoom camera, face unlock option not as secure as Face ID, raw performance short of best-in-class, not good enough value.""",
            date="2024-09-19T06:00:00Z",
            image_url="https://i.guim.co.uk/img/media/69bb80e85a280b054ee1eebf19fff33042a38948/328_358_4971_2983/master/4971.jpg?width=480&dpr=1&s=none",
        )
        event2 = Event(
            title="Google's use of AI to enhance user experience in Pixel phones",
            description="Google's implementation of AI in the Pixel 9 exemplifies how AI can make everyday technology smarter, but it also hints at the growing reliance on AI to compensate for hardware limitations. The expansion of generative AI in tasks like photo editing feels like an exciting but risky step, as users may begin to wonder whether they're sacrificing quality for convenience. This integration is impressive, but it also sets a tone for debates about where the balance between human input and AI autonomy should lie.",
            duplicate=False,
            date="2024-09-19",
            is_singapore=False,
            rating=3,
        )
        analysis2 = Analysis(
            category_id=2,
            content="The use of advanced AI models like Google's Gemini Nano demonstrates the transformative impact of AI in consumer tech, significantly enhancing photography, editing, and usability in smartphones. It also raises debates on AI's role in augmenting everyday tools, improving productivity, and shaping the future of technology, making it relevant to discussions on the ethical and social implications of AI adoption. This can be used to argue both for and against the role of AI in society.",
        )
        event2.analysises.append(analysis2)
        event2.gp_questions.append(
            GPQuestion(
                question="To what extent has AI become an integral part of our daily lives?",
                is_llm_generated=False,
            )
        )

        article2.original_events.append(event2)
        session.add(article2)
        session.add(event2)
        session.commit()

        session.refresh(article)
        session.refresh(event)
        print(article)
        print(event)

        session.refresh(article2)
        session.refresh(event2)
        print(article2)
        print(event2)
        event_id = event.id


# put_sample_events()
