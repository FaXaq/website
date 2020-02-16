import { NextPage } from "next";

interface ErrorProps {
  statusCode: number;
}

const Error: NextPage<ErrorProps> = (props: ErrorProps) => {
  return (
    <p>
      {props.statusCode
        ? `An error ${props.statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
