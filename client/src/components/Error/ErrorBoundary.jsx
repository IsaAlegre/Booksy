import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado en ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center p-6 text-red-600">
          <h2>Algo salió mal 😢</h2>
          <p>Por favor, recargá la página o volvé más tarde.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
