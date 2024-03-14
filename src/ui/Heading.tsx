import styled, { css } from "styled-components";

// Css function allows us to format code that is outside of the styled component, so we can get this and use it inside the styled component. We need this also if we want to perform some logic in the template literal
// const test = css`
//   text-align: center;
//   ${10 > 5 && "background-color:yellow;"}
// `;

const Heading = styled.h1`
  ${(props: any) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}
  ${(props: any) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}
  ${(props: any) =>
    props.as === "h3" &&
    css`
      font-size: 2rem;
      font-weight: 500;
    `}

    ${(props) =>
    props.as === "h4" &&
    css`
      font-size: 3rem;
      font-weight: 600;
      text-align: center;
    `}
  line-height:1.4
`;

export default Heading;
