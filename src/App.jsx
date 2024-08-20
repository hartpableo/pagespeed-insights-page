import { useState } from 'react';
import LoadingSpinner from "./Components/LoadingSpinner.jsx";
import { API_URL } from "./helpers/constants.js";

function App() {
  const [websiteURL, setWebsiteURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileResults, setMobileResults] = useState(null);
  const [desktopResults, setDesktopResults] = useState(null);
  const [isError, setIsError] = useState(false);
  const [finalURL, setFinalURL] = useState('');

  const requestUrl = (url, strategy) => {
    return `${API_URL}?url=${url}&strategy=${strategy}&category=performance&category=best-practices&category=seo&category=accessibility`;
  };

  const handleInputChange = (e) => {
    setWebsiteURL(e.target.value);
  };

  const handleCheckScores = async (e) => {
    e.preventDefault();

    if (!websiteURL.trim()) {
      alert('Please enter a website URL');
      return;
    }

    // Reset states before a new request
    setLoading(true);
    setIsError(false);
    setMobileResults(null);
    setDesktopResults(null);

    try {
      // Fetch mobile strategy
      const mobileResponse = await fetch(requestUrl(websiteURL, 'mobile'));
      if (!mobileResponse.ok) throw new Error('Mobile strategy request failed');

      const mobileJson = await mobileResponse.json();
      const mobileLighthouse = mobileJson.lighthouseResult;

      const mobileMetrics = {
        'Performance': mobileLighthouse.categories.performance.score * 100,
        'Best Practices': mobileLighthouse.categories['best-practices'].score * 100,
        'SEO': mobileLighthouse.categories.seo.score * 100,
        'Accessibility': mobileLighthouse.categories.accessibility.score * 100,
      };

      // Fetch desktop strategy
      const desktopResponse = await fetch(requestUrl(websiteURL, 'desktop'));
      if (!desktopResponse.ok) throw new Error('Desktop strategy request failed');

      const desktopJson = await desktopResponse.json();
      const desktopLighthouse = desktopJson.lighthouseResult;

      const desktopMetrics = {
        'Performance': desktopLighthouse.categories.performance.score * 100,
        'Best Practices': desktopLighthouse.categories['best-practices'].score * 100,
        'SEO': desktopLighthouse.categories.seo.score * 100,
        'Accessibility': desktopLighthouse.categories.accessibility.score * 100,
      };

      setFinalURL(mobileLighthouse.finalUrl); // Assuming final URL is the same for both
      setMobileResults({ mobileMetrics });
      setDesktopResults({ desktopMetrics });

      console.log('Mobile Lighthouse Metrics:', mobileLighthouse);
      console.log('Desktop Lighthouse Metrics:', desktopLighthouse);
    } catch (error) {
      setIsError(true);
      console.error('Error fetching website scores:', error);
      alert('Failed to fetch website scores. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <h1>Assess your website's performance scores!</h1>
      <form className="mt-4" onSubmit={handleCheckScores}>
        <div className="mb-3">
          <label htmlFor="websiteURL" className="form-label">
            {!isError ? 'Enter your website URL' : 'Please enter a valid URL'}
          </label>
          <input
            type="text"
            className="form-control"
            id="websiteURL"
            value={websiteURL}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Loading...' : 'Check Scores'}
        </button>

        {loading && <LoadingSpinner />}

        {finalURL && !loading && (
          <p className="mt-4 mb-2">
            Results for: <strong className="fw-bold">{finalURL}</strong>
          </p>
        )}

        {(mobileResults || desktopResults) && (
          <div className="row mt-4">
            {mobileResults && (
              <div className="col-6">
                <h3><strong>Mobile</strong> Lighthouse Metrics:</h3>
                <ul className={'mt-2'}>
                  {Object.entries(mobileResults.mobileMetrics).map(([metric, value]) => (
                    <li key={metric}>{metric}: <strong>{value}</strong></li>
                  ))}
                </ul>
              </div>
            )}

            {desktopResults && (
              <div className="col-6">
                <h3><strong>Desktop</strong> Lighthouse Metrics:</h3>
                <ul className={'mt-2'}>
                  {Object.entries(desktopResults.desktopMetrics).map(([metric, value]) => (
                    <li key={metric}>{metric}: <strong>{value}</strong></li>
                  ))}
                </ul>
              </div>
            )}

            <div className="col-12 mt-5">
              <p>More data can be displayed, check out the console logs.</p>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}

export default App;
