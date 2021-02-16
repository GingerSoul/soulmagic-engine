// @flow

import type {ElementTimelineConfigFactoryInterface} from "./ElementTimelineConfigFactoryInterface";
import type {TimelineConfig} from "./TimelineConfig";
import type {ElementStepConfigFactoryInterface} from "./ElementStepConfigFactoryInterface";

export default class ElementTimelineConfigFactory implements ElementTimelineConfigFactoryInterface
{
  #stepElementName: string
  #stepConfigFactory: ElementStepConfigFactoryInterface;

  constructor(stepElementName: string, stepConfigFactory: ElementStepConfigFactoryInterface)
  {
    this.#stepElementName = stepElementName
    this.#stepConfigFactory = stepConfigFactory;
  }

  createTimelineConfigFromElement(element: Element): TimelineConfig
  {
    let stepConfigFactory = this.#stepConfigFactory
    let steps = Array.from(element.querySelectorAll(this.#stepElementName)).map((e: Element) => {
      return stepConfigFactory.createStepConfigFromElement(e);
    })

    return {
      steps: steps,
    };
  }
}
