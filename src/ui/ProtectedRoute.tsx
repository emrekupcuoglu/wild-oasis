import styled from "styled-components";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  // 1) Load the authenticated user
  const { isPending, isAuthenticated } = useUser();

  // 3) If there is no authenticated user, redirect to login page

  useEffect(() => {
    if (!isAuthenticated && !isPending) navigate("/login");
  }, [isAuthenticated, navigate, isPending]);

  // 2) Show spinner
  if (isPending)
    return (
      <FullPage>
        <Spinner />;
      </FullPage>
    );

  // 4) If there is a authenticated user, render the app
  if (isAuthenticated) return <div>{children}</div>;
}

export default ProtectedRoute;
