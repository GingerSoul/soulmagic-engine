// @flow

import TriggerConfig from "./TriggerConfig";
import type {TTriggerConfig} from "./TTriggerConfig";
import type {StepConfig} from "./StepConfig";
import type {Gsap} from "./Gsap";

const triggerKeywordThis = '::this'

type timelines = {[string]: StepConfig[]};

export default class Anima
{
  #el: Element
  #document: Document
  #gsap: Gsap
  #timelines: timelines = {}
  #attrName: string

  #timeline: GSAPTimeline = null
  #triggers: [{element: Element, handlers: (() => void)}] = []

  constructor(el: Element, document: Document, timelines: timelines, gsap: Gsap, attrName: string)
  {
    this.#el = el
    this.#document = document
    this.#timelines = timelines
    this.#gsap = gsap
    this.#attrName = attrName
  }

  init(): void
  {
    let anima = this
    let triggersAttr = this.#el.getAttribute(this.#attrName)
    if (!triggersAttr) {
      return
    }

    let triggers = triggersAttr.split(',').map((trigger: string) => {
      return TriggerConfig.createFromString(trigger)
    })

    for (let trigger: TTriggerConfig of triggers) {
      let selector: string = trigger.selector || triggerKeywordThis
      let elements: Element[] = selector === triggerKeywordThis
        ? [this.#el]
        : this.#document.querySelectorAll(selector)

      // Get steps from timeline config
      if (!this.#timelines.hasOwnProperty(trigger.timeline)) {
        throw new Error(`Timeline ${trigger.timeline} is not registered`)
      }
      let steps = this.#timelines[trigger.timeline]

      // Create timeline instance
      this.#timeline = this.#gsap.timeline({paused: true})
      for (let step of steps) {
        let targets = this.normalizeTargets(step.targets)
        if (!targets.length) {
          continue
        }

        this.#timeline.add(this.#gsap.to(targets, step))
      }

      // Add listeners for each of the trigger elements
      for (let el: Element of elements) {
        el.addEventListener(trigger.event, () => {
          anima.#timeline.play()
        })
      }
    }
  }

  normalizeTargets(targets: mixed[]): Element[]
  {
    let normalized: Element[] = []
    let that = this

    targets.forEach(function (target) {
      if (typeof target === 'string' || target instanceof String) {
        target = that.#el.querySelectorAll(target)
      }

      if (target instanceof Element) {
        target = [target]
      }

      if (target instanceof Object && Symbol.iterator in target) {
        for (let e of target) {
          if (e instanceof Element && !normalized.includes(e)) {
            normalized.push(e)
          }
        }
      }
    })

    return normalized
  }
}
