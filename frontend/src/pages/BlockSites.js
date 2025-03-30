import React, { useState, useEffect } from 'react';
import { blockSiteService } from '../services/blockSiteService';

function BlockSites() {
  const [url, setUrl] = useState('');
  const [blockedSites, setBlockedSites] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlockedSites();
  }, []);

  const fetchBlockedSites = async () => {
    try {
      setIsLoading(true);
      const sites = await blockSiteService.getBlockedSites();
      console.log('Fetched sites:', sites);
      setBlockedSites(sites);
      setError('');
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError('Failed to fetch blocked sites. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateUrl = (url) => {
    // Basic URL validation
    const urlPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    return urlPattern.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Remove http/https and www if present
      let cleanUrl = url.toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .trim();

      if (!validateUrl(cleanUrl)) {
        setError('Please enter a valid domain (e.g., facebook.com)');
        return;
      }

      console.log('Adding site:', cleanUrl);
      const newSite = await blockSiteService.addBlockedSite(cleanUrl);
      console.log('Site added:', newSite);
      
      setBlockedSites([...blockedSites, newSite]);
      setUrl('');
      setSuccess('Website blocked successfully!');

      // Refresh the list
      fetchBlockedSites();
    } catch (err) {
      console.error('Error adding site:', err);
      setError(err.response?.data?.message || 'Failed to block website. Please try again.');
    }
  };

  const handleRemove = async (siteId) => {
    try {
      setError('');
      setSuccess('');
      
      console.log('Removing site:', siteId);
      await blockSiteService.removeBlockedSite(siteId);
      
      setBlockedSites(blockedSites.filter(site => site._id !== siteId));
      setSuccess('Website unblocked successfully!');
    } catch (err) {
      console.error('Error removing site:', err);
      setError('Failed to unblock website. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Block Distracting Websites</h1>

        {/* Messages */}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {/* Add Website Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website domain (e.g., facebook.com)"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Block'}
            </button>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Enter the website domain without 'http://' or 'www.' (e.g., facebook.com)
          </p>
        </form>

        {/* Blocked Sites List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Blocked Websites</h2>
          {isLoading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : blockedSites.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No websites blocked yet.</p>
              <p className="text-sm text-gray-400 mt-2">
                Add websites above to start blocking distractions.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {blockedSites.map((site) => (
                <div 
                  key={site._id} 
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                >
                  <span className="font-medium">{site.url}</span>
                  <button
                    onClick={() => handleRemove(site._id)}
                    className="text-red-500 hover:text-red-700 px-3 py-1 rounded-md hover:bg-red-50"
                  >
                    Unblock
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlockSites; 