(function ($, document, window) {
  //  Create timeline groups on the tlgroups object.
  //  These groups will hold 'in' and 'out' timeline definitions and instances.

  function createTimelineGroups() {
    window.tls = {};

    $("[tl]").each(function () {
      $this = $(this);

      //get its name for the object
      thisName = $this.attr("tl");

      //  set up the defaults and containers.
      window.tls[thisName] = {
        //  set default timeline definitions.

        children: [],
        defs: {
          $trigger: $this,
          hoverer: undefined,
          clicker: undefined,
          event: "scroll",
          template: false,
          scrollTrigger: {
            trigger: $this
          }
        },

        inTl: {
          event: {},
          instance: {},
          steps: {}
        }, // in-tl

        outTl: {
          event: {},
          instance: {},
          steps: {}
        } // out-tl
      }; // window.tls

      //

      //add children slots in the timelines object.

      //

      //for every child of this timeline,
      $('[use-tl="' + thisName + '"]').each(function (i) {
        
        $useTlTrigger = $(this);
        //create a slot in children array of the timelines object, and set defaults on that child.
        window.tls[thisName].children[i] = {
          defs: {
            $trigger: $useTlTrigger,
            hoverer: undefined,
            clicker: undefined,
            event: "scroll",
            template: false,
            scrollTrigger: {
              $trigger: $this
            }
          },

          inTl: {
            event: {},
            instance: {},
            steps: {}
          }, // in-tl

          outTl: {
            event: {},
            instance: {},
            steps: {}
          } // out-tl
        };
      }); // end [use-tl].each

      //

      // add timeline definitions from attributes to the definitions objects of the parent and children.

      //

      
      //get its definitions, which won't be in/out specific.
      thisTlDefs = $this.attr("tl-defs") || undefined;

      if (thisTlDefs) {
        //get the JSON
        parsedTlDefs = JSON.parse(thisTlDefs);

        //add those defs to the definitions object
        for (var key of Object.keys(parsedTlDefs)) {
          window.tls[thisName].defs[key] = parsedTlDefs[key];

          //add the defs to the children, keeping template as false so their instances get created.
          if (key !== "template") {
            //loop through each child and swap out its default defs for the ones from the timeline defs.
            window.tls[thisName].children.forEach(function (item, index) {
              item.defs[key] = parsedTlDefs[key];
            });
          }
        }
      } else {
        console.log(
          "You've defined a timeline, but the actual timeline definitions are not defined. Make sure a [tl-defs] attribute is present on the same element as your [tl] attribute."
        );
      } //end else

      
      
      
      // CREATE INSTANCES on parents and/or children

      if (!window.tls[thisName].defs.template == true) {
        //not a template (the default). Creating INSTANCE on the parent.
        window.tls[thisName].inTl.instance = gsap.timeline({ paused: true });
        window.tls[thisName].outTl.instance = gsap.timeline({ paused: true });
      } else {
        //loop through children and create in & out instances.
        window.tls[thisName].children.forEach(function (item, index) {
          item.inTl.instance = gsap.timeline({ paused: true });
          item.outTl.instance = gsap.timeline({ paused: true });
        });
      } // end if template
      
      

        // CREATING EVENTS that call instances
      
      if (!window.tls[thisName].defs.template == true) {
        
        //tl is not a template, create event on parent
        
        window.tls[thisName].inTl.event = function () {
          
          //click event
          $clicker = window.tls[thisName].defs.$trigger.find((window.tls[thisName].defs.clicker));
            console.log($clicker);
          $clicker.click(function () {
            alert("click!");
          });
          
          //hover event, etc
          
          
          
        }(); // events self-invoke.
        
      } else {
        
        // tl is a template, creating events on children
        
        console.log(99);
        window.tls[thisName].children.forEach(function (item, index) {
          console.log(item);
          item.inTl.event = function () {

            //click event

            $clicker = item.defs.$trigger.find(item.defs.clicker);
            console.log($clicker);
            $clicker.click(function () {
              //alert("click!" + index);
              item.inTl.instance.play();
            });
            
            
            //hover event, etc

            
            
          }(); // events self-invoke.

          //not adding out tl
          
        });
      }
      
      
      
      
    }); // [tl].each
  } // createTimelineGroups()

  //now that we have structures in place, we take the information that we've added to the timelines object and create timeline instances where appropriate, depending on what's called for and whether or not children exist.

  //we do this so that we're not creating empty timeline instances.

  //we might be duplicating a loop here and may find a way to sneak this into the [tl] loop at some point.

  function createTimelineInstances() {}

  //this function adds steps to in, out, and children in/out timelines.

  function addStepsToTimelines() {
    $("[add-to-in-tl]").each(function (i) {
      $this = $(this);

      //get its name for the object
      thisName = $this.attr("add-to-in-tl");

      //get the step targets
      thisInTlTargets = $this.attr("in-tl-targets") || undefined;

      //get the step vars
      thisInTlVars = $this.attr("in-tl-vars") || undefined;
      parsedInTlVars = JSON.parse(thisInTlVars);

      if (thisInTlVars) {
        window.tls[thisName].inTl.steps[i] = {};
        window.tls[thisName].inTl.steps[i].targets = thisInTlTargets;
        window.tls[thisName].inTl.steps[i].vars = thisInTlVars;

        window.tls[thisName].children.forEach(function (item, index) {
          item.inTl.steps[i] = {};
          item.inTl.steps[i].targets = thisInTlTargets;
          item.inTl.steps[i].vars = thisInTlVars;
        });
      } else {
        console.log(
          "You've defined a step, but the actual step definitions are not defined. Make sure a [in-tl-vars] attribute is present on the same element as your [add-to-in-tl] attribute."
        );
      } // end thisInTlVars

      if (!window.tls[thisName].defs.template == true) {
        //actually add the step to the timelines
        window.tls[thisName].inTl.instance.add(
          gsap.to(thisInTlTargets, parsedInTlVars),
          "=0"
        );
      } else {
        window.tls[thisName].children.forEach(function (item, index) {
          item.inTl.instance.add(
            gsap.to(thisInTlTargets, parsedInTlVars),
            "=0"
          );
        });
      }
    }); // add-to-in-tl each
  } // addStepsToTimelines

  function addEventsToTimelines() {}

  //doc ready

  $(function () {
    createTimelineGroups();
    createTimelineInstances();
  });

  //window load. Where steps get added to timelines.

  $(window).on("load", function () {
    addStepsToTimelines();
    addEventsToTimelines();

    $("body").removeClass("opacity-0");
  });
})(jQuery, document, window);
