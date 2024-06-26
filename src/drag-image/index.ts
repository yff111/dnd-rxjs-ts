import { Observable, fromEvent, tap } from "rxjs"
import { fromHTML } from "../utils"
import {
  DragDropMiddlewareHookMap,
  DragDropPayload,
  DragDropMiddlewareOperator,
} from "../types"
import { DragImageMiddlewareOptions } from "./types"

//#region defaults
export const defaultUpdateElementFn = (selectedElements: HTMLElement[]) =>
  fromHTML(
    `<div class='drag-image'>${selectedElements.length} Element(s)</div>`,
  )
//#endregion defaults

export const updateContainerStyle = (
  element: HTMLElement,
  top: number,
  left: number,
) =>
  element.setAttribute(
    "style",
    `position: fixed; z-index: 9999; top: ${top}px; left:${left}px; pointer-events: none;`,
  )

export const DEFAULTS: DragImageMiddlewareOptions = {
  updateElement: defaultUpdateElementFn,
  minElements: 0,
}
const dragImageMiddleware: DragDropMiddlewareOperator<
  Partial<DragImageMiddlewareOptions>
> = (options?) => {
  const { updateElement, minElements } = options
    ? { ...DEFAULTS, ...options }
    : DEFAULTS

  let subscription: any = null
  const customImageContainer = document.createElement("div")

  const mousemove$ = fromEvent<DragEvent>(document, "dragover")
  const update = (event: DragEvent) =>
    updateContainerStyle(customImageContainer, event.clientY, event.clientX)

  const start = () => {
    document.body.addEventListener("dragend", () => (stop(), false))
    subscription = mousemove$.subscribe(update)
  }

  const stop = () => {
    subscription?.unsubscribe()
    customImageContainer.remove()
  }
  // add dummy drag image
  const img = new Image(1, 1)
  img.src =
    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
  document.body.appendChild(img)
  return (source: Observable<DragDropPayload>) =>
    source.pipe(
      tap(({ type, originalEvent, dragElements }) =>
        (
          ({
            DragStart: () => {
              if (dragElements.length === minElements) {
                return
              }
              // set dummy drag Image
              ;(originalEvent as DragEvent).dataTransfer?.setDragImage(
                img,
                0,
                0,
              )
              start()
              customImageContainer.innerHTML = ""
              customImageContainer.appendChild(updateElement(dragElements))
              document.body.appendChild(customImageContainer)
              update(originalEvent as DragEvent)
            },
            DragEnd: () => stop(),
          }) as DragDropMiddlewareHookMap
        )[type]?.(),
      ),
    )
}

export default dragImageMiddleware
