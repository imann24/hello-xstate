import React, { useEffect } from "react";
import { useMachine } from "@xstate/react";
import { Button, Modal, ModalClose, ModalDialog, Card } from "@mui/joy";
import { machine } from "./state";

const persistedState = JSON.parse(localStorage.getItem('hello-xstate') || '{}')
const stateConfig = {}
if (Object.keys(persistedState).length) {
  stateConfig['state'] = persistedState
}

function App() {
  const [ current, send, service ] = useMachine(machine, stateConfig);

  useEffect(() => {
    const subscription = service.subscribe((state) => {
      // simple state logging
      localStorage.setItem('hello-xstate', JSON.stringify(state))
    })

    return subscription.unsubscribe
  }, [service])

  function renderState() {
    switch(current.value) {
      case "Initial":
        return (
          <Modal
            title="Modal"
            className="p-20"
            open
            onClose={() => send({ type: "modalDismiss" })}
          >
            <ModalDialog>
              <ModalClose />
              <p className="sans-serifc m-10">
                Welcome to this short state machine demo! Dismiss me to continue
              </p>
            </ModalDialog>
          </Modal>
        )
      case "ReadMore":
        return (
          <div className="mt-10">
            <p>Nice work! Next, please check these three boxes:</p>
            <div className="flex gap-4 mt-4">
              <input 
                type="checkbox"
                id="checkBox1"
                name="checkBox1"
                onClick={() => {
                  if (current.context.checkBox1) {
                    send({ type: "uncheck1" })
                  } else {
                    send({ type: "check1" })
                  }
                }}
                checked={current.context.checkBox1}
              />
              <input 
                type="checkbox"
                id="checkBox2"
                name="checkBox2"
                onClick={() => {
                  if (current.context.checkBox2) {
                    send({ type: "uncheck2" })
                  } else {
                    send({ type: "check2" })
                  }
                }}
                checked={current.context.checkBox2}
              />
              <input 
                type="checkbox"
                id="checkBox"
                name="checkBox3"
                onClick={() => {
                  if (current.context.checkBox3) {
                    send({ type: "uncheck3" })
                  } else {
                    send({ type: "check3" })
                  }
                }}
                checked={current.context.checkBox3}
              />
            </div>
          </div>
        )
      case "Done":
        return (
          <div className="mt-10">
            <Card>
              <p className="text-md">
                You did it! You checked all the boxes! 😎
              </p>
            </Card>
          </div>
        )
    }
    return null
  }

  return (
    <main className="flex flex-col pt-10 items-center justify-center">
      <h1 className="text-3xl">Xstate Test</h1>
      <div className="fixed top-10 right-10">
        <Button
          color="danger"
          onClick={() => send({ type: "reset" })}
        >
          Reset
        </Button>
      </div>
      {renderState()}
    </main>
  )
}

export { App };
