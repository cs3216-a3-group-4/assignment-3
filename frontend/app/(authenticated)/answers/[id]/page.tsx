import { UserQuestionMiniDTO } from "@/client";
import { otherMockedResp } from "../../ask/temp-mocked";

const AnswerPage = () => {
  const mockData: UserQuestionMiniDTO = otherMockedResp;
  return (
    <div className="flex flex-col bg-muted w-full h-full max-h-full px-4 md:px-8 xl:px-24 overflow-y-auto">
      <div className="flex flex-col pb-4 mb-4 sticky pt-8 top-0 bg-muted border-b-2">
        <h1 className="text-lg font-medium mb-2 text-text">
          {mockData.question}
        </h1>
        <div className="flex flex-col">
          {mockData.answer.points.map((point) => (
            <div className="flex flex-col p-4 mb-8" key={point.id}>
              <h1 className="font-semibold text-2xl">{point.title}</h1>
              <p className="text-lg">{point.body}</p>
              <div className="flex flex-col py-4">
                {point.point_analysises.map((analysis) => (
                  <div className="flex flex-col">
                    <div>
                      <p className="text-purple-800">
                        {analysis.analysis.content}
                      </p>
                      <p className="text-blue">
                        event: {analysis.analysis.event.title}
                      </p>
                    </div>
                    <p>{analysis.elaboration}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnswerPage;
