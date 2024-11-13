"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronsUpDown, EllipsisVerticalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import JippyIconSm from "@/public/jippy-icon/jippy-icon-sm";

const GP_QUESTIONS = {
  2024: [
    "To what extent are science and technology able to solve the problem of waste disposal?",
    "How desirable is it for a country to provide free healthcare for all its citizens?",
    "Evaluate the measures taken in your society to deter crime and punish criminals.",
    "‘Education today should involve more than the study of academic subjects.’ How far do you agree?",
    "Assess the view that it is always right to challenge injustice.",
    "‘Online advertisements use increasingly sophisticated methods to target consumers.’ To what extent does this bring more harm than good?",
    "‘Humour is essential for an individual’s well-being.’ Discuss.",
    "‘There is a lack of appreciation for the value of music.’ How far is this true in your society?",
  ],
  2023: [
    "How realistic is it for countries to implement a national minimum wage for all their workers?",
    "“Fossil fuels should no longer have a part in the production of energy.” Discuss",
    "Consider the view that spending money on space travel cannot be justified in today’s world.",
    "Consider the argument that there should be no censorship of the arts in modern society.",
    "“People who undertake voluntary work do so more for their benefit than for the benefit of others.” Discuss.",
    "Assess the extent to which all people in your society have the opportunity to achieve their full potential.",
    "‘The quality of human interaction is diminished by modern communication devices.’ How far do you agree?",
    "To what extent are festivals and national holidays effective in promoting unity in your society?",
    "“Regret for past actions is vital for progress.” What is your view?",
    "Evaluate the claim that sports personalities make good role models for young people.",
    "Assess the view that accurate translation between languages is always necessary.",
    "‘Young people want to change the world because they do not know it is impossible.” How far do you agree?",
  ],
  2022: [
    "Consider the view that people imprisoned for crimes should lose all their rights.",
    "Does religion still have a role in the modern world?",
    "‘Dramas on television or film are never as effective as a live performance.’ Discuss.",
    "Assess the extent to which different age groups in your society are valued equally.",
    "To what extent can individuals shape their own lives when the world is so unpredictable?",
    "‘Too many historical figures are famous for the wrong reasons.’ Discuss.",
    "‘The results of scientific research should be available to everyone.’ How far do you agree?",
    "Examine the claim that music without words lacks both meaning and appeal.",
    "Since the extinction of species is a natural phenomenon, is there any point in trying to prevent it?",
    "‘Consumerism is more of a curse than a blessing.’ How true is this of your society?",
    "Consider the view that mathematics is of little interest to most people as it is too complex.",
    "‘It is not winning, but taking part, which matters.’ How acceptable is this as an approach to life?",
  ],
  2021: [
    "How far is the pursuit of happiness the most important human goal?",
    "‘Scientific advancement breeds complacency.’ How far do you agree?",
    "‘Power these days lies more with the people than the politicians.’ To what extent is this true?",
    "To what extent has social media devalued true friendship in your society?",
    "To what extent is charitable giving desirable?",
    "‘Films are concerned with escaping from the problems of everyday life, rather than addressing them.’ Discuss.",
    "‘What an individual eats or drinks should not be the concern of the state.’ What is your view?",
    "Is news today reliable?",
    "‘The arts are nothing more than a luxury.’ How far is this true of your society?",
    "‘Staging major sporting events brings nothing but benefits to the host country.’ Discuss.",
    "Are global tourism and travel still necessary when everything can be experienced or achieved online?",
    "‘Advertising is largely about persuading people to buy what they do not need.’ How far do you agree?",
  ],
  2020: [
    "How reliable are statistics as a guide for planning the future?",
    "To what extent is human life in general about the survival of the fittest?",
    "‘Individuals achieve sporting success, not nations.’ Discuss.",
    "‘We shape our buildings, but then our buildings shape us.’ To what extent is this true of your society?",
    "To what extent can any society claim to be great?",
    "Examine the view that the scientist is concerned only with knowledge, not morality.",
    "Given greater levels of international cooperation, how necessary is it for countries to engage in the arms trade?",
    "Should politicians pursue the popular viewpoint or their own convictions, if they conflict?",
    "Is modern technology a benefit or a threat to democracy?",
    "‘An appreciation of music is vital for a fully rounded education.’ How true is this of your society?",
    "‘In a free society, there should be no restrictions on freedom of speech.’ Discuss.",
    "How far can prosperity and uncontrolled population growth go hand in hand?",
  ],
};

const Toolbox = () => {
  const [chosenQuestion, setChosenQuestion] = useState("");
  const router = useRouter();

  const fullList = Object.values(GP_QUESTIONS).flatMap(
    (questions) => questions,
    [],
  );

  const getRandomQuestion = (): string | undefined => {
    if (fullList.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * fullList.length);
    return fullList[randomIndex];
  };

  const handleClick = () => {
    setChosenQuestion(getRandomQuestion()!);
  };

  return (
    <div className="w-full p-4 sm:p-8 bg-muted overflow-y-auto h-full">
      <div className="flex w-full h-full">
        <Tabs className="w-full h-full" defaultValue="random">
          <TabsList className="flex w-full font-medium md:h-12 bg-primary-100/80 text-primary-700">
            <TabsTrigger className="w-full md:text-base" value="random">
              Magic Frog
            </TabsTrigger>
            <TabsTrigger className="w-full md:text-base" value="all">
              Past Question List
            </TabsTrigger>
          </TabsList>
          <TabsContent className="h-full" value="random">
            <div className="flex flex-col justify-center items-center h-full gap-8">
              <div onClick={handleClick}>
                <JippyIconSm
                  classname={cn("w-40 h-40 pt-4 cursor-pointer", {})}
                />
              </div>

              <p className="text-2xl font-semibold text-center">
                {chosenQuestion || "Click Jippy to get a GP question!"}
              </p>
              {chosenQuestion !== "" && (
                <Link href={`/ask?search=${chosenQuestion}`} target="_blank">
                  <Button>Ask Jippy</Button>
                </Link>
              )}
            </div>
          </TabsContent>
          <TabsContent value="all">
            {Object.entries(GP_QUESTIONS)
              // ts-expect-error steps is in an hour idc about types
              .sort((a, b) => b[0] - a[0])
              .map(([year, questionList]) => (
                <Collapsible defaultOpen={true} key={year}>
                  <div className="flex items-center justify-between space-x-4 px-4">
                    <h4 className="text-sm font-semibold">{year}</h4>
                    <CollapsibleTrigger>
                      <Button className="w-9 p-0" size="sm" variant="ghost">
                        <ChevronsUpDown className="h-4 w-4" />
                        <span className="sr-only">{year}</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent>
                    <div className="flex flex-col gap-2 px-2">
                      {questionList.map((question, index) => (
                        <div
                          className="hover:bg-primary-100 p-2 flex justify-between items-center"
                          key={question}
                        >
                          <div>
                            {index + 1}. {question}
                          </div>
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className="p-0"
                                  size="sm"
                                  variant="ghost"
                                >
                                  <EllipsisVerticalIcon className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() =>
                                    router.push(`/ask?search=${question}`)
                                  }
                                >
                                  Ask Jippy
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Toolbox;
