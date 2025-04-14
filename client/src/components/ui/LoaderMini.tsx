import styled, { keyframes } from "styled-components";
import { LoaderCircle } from "lucide-react";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;
const LoaderMini = styled(LoaderCircle)`
  width: 2rem;
  height: 2rem;
  animation: ${rotate} 1.5s infinite linear;
`;

export default LoaderMini;
