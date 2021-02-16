// @flow

import type {StepConfig} from "./StepConfig";
import Anima from "./Anima";
import {ElementStepConfigFactory, ElementStepConfigFactoryInterface, TriggerConfig} from "./index";
import type {Gsap} from "./Gsap";
import type {TTriggerConfig} from "./TTriggerConfig";

type timelines =  {[string]: StepConfig[]}

export default class App
{
  #document: Document
  #gsap: Gsap
  #timelines: timelines
  #subjects: Element[]
  #animas: Anima[] = []
  #attrName: string

  constructor(timelines: timelines, subjects: Element[], document: Document, gsap: Gsap, attrName: string)
  {
    this.#document = document
    this.#gsap = gsap
    this.#timelines = timelines
    this.#subjects = subjects
    this.#attrName = attrName
  }

  /**
   * Creates Anima instances for each element identified as a SoulMagic root.
   */
  init(): void
  {
    let app: App = this
    this.#subjects.forEach((subject: Element) => {
      let anima: Anima = new Anima(subject, app.#document, app.#timelines, app.#gsap, app.#attrName)
      anima.init()
      app.#animas.push(anima)
    })
  }

  static createFromDocument(document: Document, keyAttribute: string, gsap: Gsap): App
  {
    let stepConfigFactory = new ElementStepConfigFactory()
    let root:Element = document.querySelector('soulMagic')
    let timelines: timelines = {}

    // Populate timelines
    root.querySelectorAll('timeline').forEach((tl: Element) => {
      let name = tl.getAttribute('name')

      timelines[name] = Array.prototype.map.call(tl.querySelectorAll('step'), ((step: Element) => {
        return stepConfigFactory.createStepConfigFromElement(step)
      }))
    })

    // Populate subjects
    let subjects = Array.prototype.map.call(document.querySelectorAll(`[${keyAttribute}]`), (subject: Element) => subject)

    return new App(timelines, subjects, document, gsap, keyAttribute)
  }
}

