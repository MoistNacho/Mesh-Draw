import { useEffect } from "react";

const useDidMount = (fn: () => void): void => useEffect(fn, []);

export default useDidMount;
