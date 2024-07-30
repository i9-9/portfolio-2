import * as React from "react"
const SvgComponent = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    {...props}
  >
    <path stroke="#191919" d="m1 1 19.799 19.799M1 21 20.799 1.201" />
  </svg>
)
export default SvgComponent
