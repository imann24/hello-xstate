import { setup, and, assign } from "xstate";

export const machine = setup({
  types: {
    context: {} as {
      checkBox1: boolean;
      checkBox2: boolean;
      checkBox3: boolean;
    },
    events: {} as
      | { type: "reset" }
      | { type: "check1" }
      | { type: "modalDismiss" }
      | { type: "check2" }
      | { type: "check3" }
      | { type: "uncheck1" }
      | { type: "uncheck2" }
      | { type: "uncheck3" },
  },
  actions: {
    uncheck1: assign({
      checkBox1: false,
    }),
    uncheck2: assign({
      checkBox2: false,
    }),
    uncheck3: assign({
      checkBox3: false,
    }),
    check1: assign({
      checkBox1: true,
    }),
    check2: assign({
      checkBox2: true,
    }),
    check3: assign({
      checkBox3: true,
    }),
  },
  guards: {
    allChecked: and([
      ({ context, event }) => {
        // Add a guard condition here
        return context.checkBox1 && context.checkBox2 && context.checkBox3;
      },
    ]),
  },
}).createMachine({
  context: {
    checkBox1: false,
    checkBox2: false,
    checkBox3: false,
  },
  id: "Test",
  initial: "Initial",
  states: {
    Initial: {
      on: {
        modalDismiss: {
          target: "ReadMore",
        },
      },
    },
    ReadMore: {
      on: {
        reset: {
          target: "Initial",
          actions: [
            {
              type: "uncheck1",
            },
            {
              type: "uncheck2",
            },
            {
              type: "uncheck3",
            },
          ],
        },
        check1: {
          target: "ReadMore",
          actions: {
            type: "check1",
          },
        },
        check2: {
          target: "ReadMore",
          actions: {
            type: "check2",
          },
        },
        check3: {
          target: "ReadMore",
          actions: {
            type: "check3",
          },
        },
        uncheck1: {
          actions: {
            type: "uncheck1",
          },
        },
        uncheck2: {
          actions: {
            type: "uncheck2",
          },
        },
        uncheck3: {
          actions: {
            type: "uncheck3",
          },
        },
      },
      always: {
        target: "Done",
        guard: {
          type: "allChecked",
        },
      },
    },
    Done: {
      on: {
        reset: {
          target: "Initial",
          actions: [
            {
              type: "uncheck1",
            },
            {
              type: "uncheck2",
            },
            {
              type: "uncheck3",
            },
          ],
        },
      },
    },
  },
});
