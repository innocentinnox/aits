import styled, { keyframes } from "styled-components";
import { LoaderCircle } from "lucide-react";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;
const Loader = styled(LoaderCircle)`
  width: 1.5rem;
  height: 1.5rem;
  animation: ${rotate} 1.5s infinite linear;
`;

export default function LoaderMini({ color }: { color: string }) {
  return <Loader color={color} />;
}
