// @flow

import type {StepConfig} from "./StepConfig";
import type {TimelineConfig} from "./TimelineConfig";

export interface ElementTimelineConfigFactoryInterface
{
  createTimelineConfigFromElement(element: Element): TimelineConfig;
}
