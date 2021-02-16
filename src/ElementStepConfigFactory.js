// @flow

import type {ElementStepConfigFactoryInterface} from "./ElementStepConfigFactoryInterface";
import type {StepConfig} from "./StepConfig";
import {getAttributeMap} from "./functions";

export default class ElementStepConfigFactory implements ElementStepConfigFactoryInterface
{
  createStepConfigFromElement(element: Element): StepConfig
  {
    let attributes = getAttributeMap(element)
    let config = {...attributes}

    if (attributes.hasOwnProperty('targets') && typeof attributes.targets === 'string') {
      config.targets = attributes.targets.split(',').map((selector: string) => {
        return selector.trim();
      })
    }

    // $FlowFixMe Let's assume that the user input is correct for now
    return config;
  }
}
