import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react"; // Icons for expanding/collapsing

interface Feature {
  title: string;
  description: string;
  icon: JSX.Element;
  featureRender: JSX.Element;
}

interface FeatureListProps {
  features: Feature[];
}

const FeatureList = ({ features }: FeatureListProps) => {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(
    features[0] || null,
  );

  const handleClick = (feature: Feature) => {
    setSelectedFeature(feature === selectedFeature ? null : feature);
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center md:gap-8 w-full">
      {/* List of features with initially-hidden description */}
      <div className="grow md:basis-1/3 space-y-4">
        {features.map((feature, index) => (
          <div
            className="w-full max-w-full cursor-pointer border-b pb-2"
            key={index}
            onClick={() => handleClick(feature)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-2">
                {feature.icon}
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              {selectedFeature === feature ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
            {selectedFeature === feature && (
              <div className="mt-2 max-w-full">
                <p className="text-sm text-gray-600 text-wrap">
                  {feature.description}
                </p>
                <div
                  className="mt-4 flex flex-col w-full items-stretch cursor-default md:hidden"
                  id="mobile-demo"
                  onClick={(e) => e.stopPropagation()}
                >
                  {feature.featureRender}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Feature demo */}
      <div
        className="hidden md:grow md:flex md:flex-col md:basis-2/3 md:items-stretch md:justify-center"
        id="desktop-demo"
      >
        {selectedFeature ? (
          selectedFeature.featureRender
        ) : features[0] ? (
          features[0].featureRender
        ) : (
          <p className="text-gray-500">Select a feature to view details</p>
        )}
      </div>
    </div>
  );
};

export default FeatureList;
