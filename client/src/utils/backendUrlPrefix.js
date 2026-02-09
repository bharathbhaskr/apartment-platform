import PORT from "./configure2";

const port = PORT || 5000;

const backendUrlPrefix=`http://localhost:${port}`;

export default backendUrlPrefix;