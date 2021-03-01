// @flow

import type {TTriggerConfig} from "./TTriggerConfig";

export default class TriggerConfig
{
  selector: ?string
  event: string
  timeline: string

  constructor(event: string, timeline: string, selector: ?string)
  {
    this.selector = selector
    this.event = event
    this.timeline = timeline
  }

  static createFromString(string: string): TTriggerConfig
  {
    let expr = /(?:\((?<selector>[^\)]*)\)\s)?(?<event>[\w\d_-]+):\s*(?<timeline>[\w\d_-]+)/
    let match = expr.exec(string)
    let matches = match && match.groups || {}

    if (!matches.event) {
      throw new Error('Event name must be specified')
    }

    if (!matches.timeline) {
      throw new Error('Timeline name must be specified')
    }

    return new TriggerConfig(matches.event, matches.timeline, matches.selector || null)
  }
}
