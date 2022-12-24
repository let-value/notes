import { Button } from "evergreen-ui";
import { useState } from "react";

function App() {
    const [count, setCount] = useState(0);
    return (
        <Button appearance="primary" onClick={() => setCount((count) => count + 1)}>
            Count: {count}
        </Button>
    );
}

export default App;
