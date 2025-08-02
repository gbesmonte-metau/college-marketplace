import "../components-css/Loading.css";

export default function Loading({ isLoading }) {
  return (
    <div>
      {isLoading && (
        <div className="loading-modal">
          <div className="loading">
            <div className="loading-body">
              <div className="emoji">
                <span>🪴</span>
                <span>🛏️</span>
                <span>🛴</span>
                <span>👕</span>
                <span>🧺</span>
                <span>🛋️</span>
                <span>🪑</span>
              </div>
              <h1>Loading...</h1>
              <div className="loader"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
