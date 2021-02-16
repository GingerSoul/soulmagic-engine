// @flow

import type {StepConfig} from "./StepConfig";

export interface ElementStepConfigFactoryInterface
{
  createStepConfigFromElement(element: Element): StepConfig
}
