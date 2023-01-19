import { PropsWithChildren, PureComponent } from "react";

export class ErrorBoundary extends PureComponent<PropsWithChildren<unknown>, { hasError: boolean }> {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}
