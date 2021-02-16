// @flow

export interface Gsap {
  timeline (vars: {}): GSAPTimeline

  to (targets: Element[] | string[] | string | Object | Object[], vars: {[string]: mixed}): GSAPTween
}
