'use client';

import { useState } from 'react';
import Image from 'next/image';
import AdminHeader from '@/components/admin/AdminHeader';
import {
  FolderOpen,
  Upload,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Copy,
  Check,
  Download,
  Trash2,
  Plus,
  X,
  Search,
} from 'lucide-react';

const INITIAL_MEDIA = [
  {
    id: 'med-01',
    title: 'Kimoksha Clean Brand Logo',
    file_name: 'kimoksha-logo-clean.png',
    type: 'IMAGE',
    file_size: '42.8 KB',
    mime_type: 'image/png',
    url: '/kimoksha-logo-clean.png',
    created_at: '2026-09-01',
  },
  {
    id: 'med-02',
    title: 'High-Res Browser Favicon',
    file_name: 'Favicon.png',
    type: 'IMAGE',
    file_size: '18.2 KB',
    mime_type: 'image/png',
    url: '/Favicon.png',
    created_at: '2026-09-01',
  },
  {
    id: 'med-03',
    title: 'Wholesale A2P SMS Q3 Standard Deck',
    file_name: 'Kimoksha_AZ_SMS_Q3_2026.xlsx',
    type: 'SPREADSHEET',
    file_size: '1.8 MB',
    mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    url: '/uploads/Kimoksha_AZ_SMS_Q3_2026.xlsx',
    created_at: '2026-09-10',
  },
  {
    id: 'med-04',
    title: 'Equinix DX1 Direct Cross-Connect LOA',
    file_name: 'Equinix_DX1_CrossConnect_LOA.pdf',
    type: 'DOCUMENT',
    file_size: '480 KB',
    mime_type: 'application/pdf',
    url: '/uploads/Equinix_DX1_CrossConnect_LOA.pdf',
    created_at: '2026-09-08',
  },
  {
    id: 'med-05',
    title: 'Bilateral Carrier Voice Interconnect MSA',
    file_name: 'Kimoksha_Bilateral_Carrier_Agreement.pdf',
    type: 'DOCUMENT',
    file_size: '920 KB',
    mime_type: 'application/pdf',
    url: '/uploads/Kimoksha_Bilateral_Carrier_Agreement.pdf',
    created_at: '2026-09-05',
  },
];

export default function MediaPage() {
  const [mediaList, setMediaList] = useState(INITIAL_MEDIA);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFile, setNewFile] = useState({
    title: '',
    file_name: '',
    type: 'DOCUMENT',
  });

  const filteredMedia = mediaList.filter((m) => {
    const matchesFilter = activeFilter === 'ALL' || m.type === activeFilter;
    const matchesSearch =
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const copyUrl = (id, url) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!newFile.title || !newFile.file_name) return;

    const created = {
      id: `med-0${mediaList.length + 1}`,
      title: newFile.title,
      file_name: newFile.file_name,
      type: newFile.type,
      file_size: '650 KB',
      mime_type: newFile.type === 'IMAGE' ? 'image/png' : 'application/pdf',
      url: `/uploads/${newFile.file_name}`,
      created_at: new Date().toISOString().slice(0, 10),
    };

    setMediaList([created, ...mediaList]);
    setShowUploadModal(false);
    setNewFile({ title: '', file_name: '', type: 'DOCUMENT' });
  };

  const handleDelete = (id) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
  };

  return (
    <>
      <AdminHeader
        title="Corporate Media & Document Assets"
        subtitle="Manage brand logos, carrier rate sheet templates, interconnect LOAs, and technical collateral."
      />

      <div className="media-page">
        {/* Controls Bar */}
        <div className="media-top-bar">
          <div className="filter-pills">
            {['ALL', 'IMAGE', 'SPREADSHEET', 'DOCUMENT'].map((filter) => (
              <button
                key={filter}
                className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === 'ALL' ? 'All Assets' : filter.toLowerCase() + 's'}
              </button>
            ))}
          </div>

          <div className="top-right-actions">
            <div className="search-wrap">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button onClick={() => setShowUploadModal(true)} className="btn-upload">
              <Plus size={16} />
              <span>Upload Asset</span>
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="media-grid">
          {filteredMedia.length === 0 ? (
            <div className="empty-state">
              <FolderOpen size={36} className="empty-icon" />
              <p>No media files found matching your search.</p>
            </div>
          ) : (
            filteredMedia.map((m) => (
              <div key={m.id} className="media-card">
                <div className="preview-wrap">
                  {m.type === 'IMAGE' ? (
                    <div className="img-holder">
                      <Image
                        src={m.url}
                        alt={m.title}
                        width={120}
                        height={40}
                        style={{ objectFit: 'contain' }}
                      />
                    </div>
                  ) : m.type === 'SPREADSHEET' ? (
                    <div className="icon-holder green">
                      <FileSpreadsheet size={36} />
                    </div>
                  ) : (
                    <div className="icon-holder blue">
                      <FileText size={36} />
                    </div>
                  )}
                  <span className="type-badge">{m.type}</span>
                </div>

                <div className="media-details">
                  <h4 className="media-title">{m.title}</h4>
                  <div className="file-sub">
                    <span>{m.file_name}</span>
                    <span>•</span>
                    <span>{m.file_size}</span>
                  </div>

                  <div className="media-actions">
                    <button
                      onClick={() => copyUrl(m.id, m.url)}
                      className={`btn-action ${copiedId === m.id ? 'copied' : ''}`}
                    >
                      {copiedId === m.id ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copiedId === m.id ? 'Copied' : 'Copy URL'}</span>
                    </button>
                    <button onClick={() => handleDelete(m.id)} className="btn-trash" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-backdrop" onClick={() => setShowUploadModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Upload Media or Document</h3>
                <p className="modal-sub">Add brand assets or downloadable carrier agreements.</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="btn-close">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="modal-form">
              <div className="form-group">
                <label>Asset Display Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kimoksha SMS Rate Card Template 2026"
                  value={newFile.title}
                  onChange={(e) => setNewFile({ ...newFile, title: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>File Category *</label>
                  <select
                    value={newFile.type}
                    onChange={(e) => setNewFile({ ...newFile, type: e.target.value })}
                  >
                    <option value="DOCUMENT">PDF Document / Agreement</option>
                    <option value="SPREADSHEET">Excel / CSV Rate Deck</option>
                    <option value="IMAGE">Brand Logo / SVG</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>File Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rate_deck_template.xlsx"
                    value={newFile.file_name}
                    onChange={(e) => setNewFile({ ...newFile, file_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Upload Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .media-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .media-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        @media (max-width: 640px) {
          .media-top-bar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          .filter-pills {
            overflow-x: auto;
            max-width: 100%;
          }
          .top-right-actions {
            flex-direction: column;
            align-items: stretch;
          }
          .search-wrap {
            width: 100%;
          }
          .search-wrap input {
            width: 100% !important;
          }
          .btn-upload {
            justify-content: center;
          }
        }
        .filter-pills {
          display: flex;
          align-items: center;
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 3px;
          gap: 2px;
        }
        .filter-btn {
          background: transparent;
          border: none;
          color: var(--admin-text-muted);
          font-size: 0.775rem;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 6px;
          cursor: pointer;
          text-transform: capitalize;
          transition: all 0.15s ease;
        }
        .filter-btn:hover {
          color: var(--admin-text);
        }
        .filter-btn.active {
          background: var(--admin-accent);
          color: #ffffff;
        }
        .top-right-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .search-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 8px;
          padding: 0 0.75rem;
        }
        .search-icon {
          color: var(--admin-text-dim);
        }
        .search-wrap input {
          background: transparent;
          border: none;
          color: var(--admin-text);
          font-size: 0.8rem;
          padding: 0.6rem 0;
          outline: none;
          width: 160px;
        }
        .btn-upload {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--admin-accent);
          color: #ffffff;
          border: none;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-upload:hover {
          background: var(--admin-accent-hover);
        }
        .media-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .media-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .media-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .media-card {
          background: var(--admin-card);
          border: 1px solid var(--admin-border);
          border-radius: 12px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .preview-wrap {
          height: 120px;
          background: var(--admin-card-inner);
          border-bottom: 1px solid var(--admin-border);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 1rem;
        }
        .type-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          font-size: 9px;
          font-weight: 800;
          background: rgba(0, 0, 0, 0.4);
          color: #ffffff;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }
        .icon-holder.green {
          color: #10b981;
        }
        .icon-holder.blue {
          color: #38bdf8;
        }
        .media-details {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }
        .media-title {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--admin-text);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .file-sub {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.725rem;
          color: var(--admin-text-dim);
          font-family: monospace;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .media-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid var(--admin-border-subtle);
          margin-top: auto;
        }
        .btn-action {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--admin-card-inner);
          border: 1px solid var(--admin-border);
          color: var(--admin-text-secondary);
          font-size: 0.725rem;
          font-weight: 600;
          padding: 5px 10px;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-action:hover {
          border-color: var(--admin-accent);
          color: var(--admin-accent);
        }
        .btn-action.copied {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.3);
        }
        .btn-trash {
          background: transparent;
          border: 1px solid var(--admin-border);
          color: var(--admin-text-dim);
          padding: 5px 8px;
          border-radius: 6px;
          cursor: pointer;
        }
        .btn-trash:hover {
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.4);
        }
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 1rem;
          color: var(--admin-text-dim);
        }
        .empty-icon {
          color: var(--admin-text-dim);
          margin-bottom: 0.75rem;
        }
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .modal-card {
          background: var(--admin-surface);
          border: 1px solid var(--admin-border);
          border-radius: 14px;
          max-width: 480px;
          width: 100%;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          box-shadow: var(--admin-shadow);
        }
        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          border-bottom: 1px solid var(--admin-border);
          padding-bottom: 0.75rem;
        }
        .modal-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--admin-text);
          margin: 0;
        }
        .modal-sub {
          font-size: 0.75rem;
          color: var(--admin-text-muted);
          margin: 2px 0 0 0;
        }
        .btn-close {
          background: transparent;
          border: none;
          color: var(--admin-text-dim);
          cursor: pointer;
        }
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }
        .form-group label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--admin-text-secondary);
        }
        .form-group input,
        .form-group select {
          background: var(--admin-input-bg);
          border: 1px solid var(--admin-input-border);
          border-radius: 8px;
          padding: 8px 12px;
          color: var(--admin-text);
          font-size: 0.85rem;
          outline: none;
        }
        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--admin-accent);
        }
        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.5rem;
          border-top: 1px solid var(--admin-border);
          padding-top: 0.75rem;
        }
        .btn-cancel {
          background: transparent;
          border: 1px solid var(--admin-border);
          color: var(--admin-text-secondary);
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.8rem;
          cursor: pointer;
        }
        .btn-submit {
          background: var(--admin-accent);
          color: #ffffff;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-submit:hover {
          background: var(--admin-accent-hover);
        }
      `}</style>
    </>
  );
}
