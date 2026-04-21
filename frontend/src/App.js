import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const shimmer = keyframes`
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const toastIn = keyframes`
  from { opacity: 0; transform: translateX(-50%) translateY(12px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 24px 120px;
  animation: ${fadeIn} 0.4s ease;
`;

const Header = styled.header`
  width: 100%;
  max-width: 680px;
  margin-bottom: 48px;
  animation: ${fadeUp} 0.5s ease both;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 400;
  letter-spacing: -0.5px;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: var(--text-tertiary);
  font-weight: 300;
`;

const ServerTag = styled.span`
  font-family: var(--font-mono);
  font-size: 11px;
  background: var(--accent-light);
  color: var(--text-secondary);
  padding: 3px 8px;
  border-radius: 6px;
  margin-left: 10px;
  vertical-align: middle;
  position: relative;
  top: -1px;
`;

const Content = styled.main`
  width: 100%;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// ─── Upload Zone ───────────────────────────────────────────────────────────────


const DropZone = styled.div`
  border: 1.5px dashed ${p => p.$dragging ? 'var(--text-primary)' : 'var(--border-strong)'};
  border-radius: var(--radius-xl);
  padding: 48px 32px;
  text-align: center;
  cursor: pointer;
  transition: all var(--transition);
  background: ${p => p.$dragging ? 'var(--accent-light)' : 'var(--surface)'};
  animation: ${fadeUp} 0.5s 0.05s ease both;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: var(--text-primary);
    background: var(--surface-hover);
  }
`;

const DropIcon = styled.div`
  font-size: 32px;
  margin-bottom: 12px;
  transition: transform var(--transition);
  ${p => p.$dragging && css`transform: scale(1.15);`}
`;

const DropText = styled.p`
  font-size: 15px;
  font-weight: 400;
  color: var(--text-primary);
  margin-bottom: 4px;
`;

const DropSub = styled.p`
  font-size: 13px;
  color: var(--text-tertiary);
  font-weight: 300;
`;

const HiddenInput = styled.input`
  display: none;
`;

const DeleteBtn = styled.button`
  opacity: 0;
  transition: opacity var(--transition);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-tertiary);
  padding: 4px 6px;
  border-radius: 6px;
  flex-shrink: 0;

  &:hover {
    color: var(--danger);
    background: rgba(201, 64, 64, 0.08);
  }
`;

// ─── Progress ─────────────────────────────────────────────────────────────────

const ProgressWrap = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  border: 1px solid var(--border);
  animation: ${fadeUp} 0.3s ease both;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 10px;
  font-family: var(--font-mono);
`;

const ProgressTrack = styled.div`
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--text-primary);
  border-radius: 2px;
  width: ${p => p.$pct}%;
  transition: width 0.2s ease;
`;

// ─── Search ───────────────────────────────────────────────────────────────────

const SearchWrap = styled.div`
  position: relative;
  animation: ${fadeUp} 0.5s 0.1s ease both;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 16px 0 40px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--text-primary);
  outline: none;
  transition: all var(--transition);

  &::placeholder { color: var(--text-tertiary); }

  &:focus {
    border-color: var(--text-primary);
    box-shadow: 0 0 0 3px rgba(26,25,23,0.06);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
  font-size: 15px;
  pointer-events: none;
`;

const FileCount = styled.div`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-tertiary);
`;

// ─── File List ────────────────────────────────────────────────────────────────

const SectionLabel = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-tertiary);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0 4px;
  margin-top: 8px;
  animation: ${fadeUp} 0.5s 0.15s ease both;
`;

const FileList = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  overflow: hidden;
  animation: ${fadeUp} 0.5s 0.2s ease both;
`;

const FileRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 18px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background var(--transition);
  position: relative;

  &:last-child { border-bottom: none; }
  &:hover { background: var(--surface-hover); }
  &:hover .download-hint { opacity: 1; }
  &:active { background: var(--accent-light); }
`;

const FileIconWrap = styled.div`
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--accent-light);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
`;

const FileMeta = styled.div`
  flex: 1;
  min-width: 0;
`;

const FileName = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const FileExt = styled.span`
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--text-tertiary);
  background: var(--bg);
  padding: 1px 5px;
  border-radius: 4px;
  margin-left: 6px;
`;

const DownloadHint = styled.div`
  font-size: 12px;
  color: var(--text-tertiary);
  opacity: 0;
  transition: opacity var(--transition);
  className: download-hint;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 18px;
  border-bottom: 1px solid var(--border);
  &:last-child { border-bottom: none; }
`;

const SkeletonBase = css`
  background: linear-gradient(90deg, var(--bg) 25%, var(--accent-light) 50%, var(--bg) 75%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.4s ease infinite;
  border-radius: 6px;
`;

const SkeletonBox = styled.div`
  ${SkeletonBase}
  width: ${p => p.$w || '100px'};
  height: ${p => p.$h || '14px'};
  flex-shrink: 0;
  border-radius: ${p => p.$round ? '50%' : '6px'};
`;

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = styled.div`
  padding: 48px 32px;
  text-align: center;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: var(--text-tertiary);
  font-weight: 300;
`;

// ─── Toast ────────────────────────────────────────────────────────────────────

const Toast = styled.div`
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--text-primary);
  color: #fff;
  font-size: 13px;
  padding: 10px 20px;
  border-radius: var(--radius-md);
  animation: ${toastIn} 0.25s ease;
  white-space: nowrap;
  z-index: 100;
  font-family: var(--font-sans);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 8px;
`;

// ─── Spinner ──────────────────────────────────────────────────────────────────

const Spinner = styled.div`
  width: 14px;
  height: 14px;
  border: 1.5px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  const map = {
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🖼️', heic: '🖼️',
    mp4: '🎬', mov: '🎬', avi: '🎬', mkv: '🎬', webm: '🎬',
    mp3: '🎵', wav: '🎵', flac: '🎵', aac: '🎵', ogg: '🎵',
    pdf: '📕',
    doc: '📝', docx: '📝',
    xls: '📊', xlsx: '📊',
    ppt: '📋', pptx: '📋',
    zip: '🗜️', rar: '🗜️', '7z': '🗜️', tar: '🗜️', gz: '🗜️',
    js: '💻', ts: '💻', jsx: '💻', tsx: '💻', py: '💻',
    java: '💻', cpp: '💻', c: '💻', html: '💻', css: '💻', json: '💻',
    txt: '📄', md: '📄', log: '📄',
  };
  return map[ext] || '📦';
}

function getExt(name) {
  return name.includes('.') ? name.split('.').pop().toLowerCase() : null;
}

function baseName(name) {
  const idx = name.lastIndexOf('.');
  return idx > 0 ? name.slice(0, idx) : name;
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadLabel, setUploadLabel] = useState('');
  const [toast, setToast] = useState(null);
  const [toastLoading, setToastLoading] = useState(false);
  const inputRef = useRef();
  const dragCounter = useRef(0);
  const toastTimer = useRef();

  const API = `http://${window.location.hostname}:8080`;

  const showToast = useCallback((msg, isLoading = false, duration = 2800) => {
    clearTimeout(toastTimer.current);
    setToast(msg);
    setToastLoading(isLoading);
    if (!isLoading) {
      toastTimer.current = setTimeout(() => setToast(null), duration);
    }
  }, []);

  const loadFiles = useCallback(async () => {
    try {
      const res = await fetch(`${API}/files`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFiles(data);
    } catch {
      showToast('Cannot reach server');
    } finally {
      setLoading(false);
    }
  }, [API, showToast]);

  useEffect(() => {
    loadFiles();
    const interval = setInterval(loadFiles, 8000);
    return () => clearInterval(interval);
  }, [loadFiles]);

  const uploadFiles = useCallback(async (fileList) => {
    const arr = Array.from(fileList);
    if (!arr.length) return;
    setUploading(true);
    setProgress(0);
    let done = 0;
    for (const file of arr) {
      setUploadLabel(`Uploading ${file.name}`);
      showToast(`Uploading ${file.name}…`, true);
      const fd = new FormData();
      fd.append('file', file);
      try {
        await new Promise((res, rej) => {
          const xhr = new XMLHttpRequest();
          xhr.upload.onprogress = e => {
            if (e.lengthComputable) {
              const overall = ((done + e.loaded / e.total) / arr.length) * 100;
              setProgress(overall);
            }
          };
          xhr.onload = () => (xhr.status === 200 ? res() : rej());
          xhr.onerror = rej;
          xhr.open('POST', `${API}/upload`);
          xhr.send(fd);
        });
        done++;
      } catch {
        showToast(`Failed: ${file.name}`);
      }
    }
    setUploading(false);
    setProgress(0);
    showToast(done === arr.length ? `${done} file${done > 1 ? 's' : ''} uploaded` : `${done}/${arr.length} uploaded`);
    loadFiles();
  }, [API, loadFiles, showToast]);

  const downloadFile = useCallback((name) => {
    const a = document.createElement('a');
    a.href = `${API}/files/${encodeURIComponent(name)}`;
    a.download = name;
    a.click();
  }, [API]);

  const deleteFile = useCallback(async (name, e) => {
  e.stopPropagation(); // prevent triggering the download
  try {
    await fetch(`${API}/files/${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
    showToast(`${name} deleted`);
    loadFiles();
  } catch {
    showToast('Could not delete file');
  }
}, [API, loadFiles, showToast]);

  // Drag handlers
  const onDragEnter = (e) => {
    e.preventDefault();
    dragCounter.current++;
    setDragging(true);
  };
  const onDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current <= 0) { dragCounter.current = 0; setDragging(false); }
  };
  const onDragOver = (e) => e.preventDefault();
  const onDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    setDragging(false);
    uploadFiles(e.dataTransfer.files);
  };

  const filtered = files.filter(f =>
    f.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Page
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <Header>
        <Title>
          Drop
          <ServerTag>{window.location.hostname}:8080</ServerTag>
        </Title>
        <Subtitle>Local network file sharing</Subtitle>
      </Header>

      <Content>
        {/* Upload Zone */}
        <DropZone $dragging={dragging} onClick={() => inputRef.current.click()}>
          <DropIcon $dragging={dragging}>{dragging ? '📂' : '↑'}</DropIcon>
          <DropText>{dragging ? 'Release to upload' : 'Drop files here'}</DropText>
          <DropSub>or click to browse</DropSub>
          <HiddenInput
            ref={inputRef}
            type="file"
            multiple
            onChange={e => { uploadFiles(e.target.files); e.target.value = ''; }}
          />
        </DropZone>

        {/* Upload Progress */}
        {uploading && (
          <ProgressWrap>
            <ProgressLabel>
              <span>{uploadLabel}</span>
              <span>{Math.round(progress)}%</span>
            </ProgressLabel>
            <ProgressTrack>
              <ProgressFill $pct={progress} />
            </ProgressTrack>
          </ProgressWrap>
        )}

        {/* Search */}
        {!loading && files.length > 0 && (
          <SearchWrap>
            <SearchIcon>⌕</SearchIcon>
            <SearchInput
              type="text"
              placeholder="Search files…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <FileCount>
              {search ? `${filtered.length} / ${files.length}` : `${files.length} files`}
            </FileCount>
          </SearchWrap>
        )}

        {/* File List */}
        {!loading && (filtered.length > 0 || files.length === 0) && (
          <>
            {filtered.length > 0 && (
              <SectionLabel>Files</SectionLabel>
            )}
            <FileList>
              {loading ? (
                [1,2,3].map(i => (
                  <SkeletonRow key={i}>
                    <SkeletonBox $w="36px" $h="36px" $round />
                    <div style={{flex:1, display:'flex', flexDirection:'column', gap:'6px'}}>
                      <SkeletonBox $w="160px" $h="13px" />
                      <SkeletonBox $w="90px" $h="11px" />
                    </div>
                  </SkeletonRow>
                ))
              ) : filtered.length === 0 && files.length === 0 ? (
                <EmptyState>
                  <EmptyText>No files yet — drop something above</EmptyText>
                </EmptyState>
              ) : filtered.length === 0 ? (
                <EmptyState>
                  <EmptyText>No files match "{search}"</EmptyText>
                </EmptyState>
              ) : (
                filtered.map(name => {
                  const ext = getExt(name);
                  const base = baseName(name);
                  return (
                    <FileRow key={name} onClick={() => downloadFile(name)}>
                      <FileIconWrap>{getFileIcon(name)}</FileIconWrap>
                      <FileMeta>
                        <FileName>
                          {base}
                          {ext && <FileExt>.{ext}</FileExt>}
                        </FileName>
                      </FileMeta>
                      <DownloadHint className="download-hint">
                        ↓ download
                      </DownloadHint>
                      <DeleteBtn
                        className="download-hint"
                        onClick={(e) => deleteFile(name, e)}
                        title="Delete"
                      >
                        ✕
                      </DeleteBtn>
                    </FileRow>
                  );
                })
              )}
            </FileList>
          </>
        )}

        {/* Skeleton loading state */}
        {loading && (
          <FileList>
            {[1,2,3,4].map(i => (
              <SkeletonRow key={i}>
                <SkeletonBox $w="36px" $h="36px" style={{borderRadius:'8px'}} />
                <div style={{flex:1, display:'flex', flexDirection:'column', gap:'6px'}}>
                  <SkeletonBox $w={`${120 + i * 20}px`} $h="13px" />
                </div>
              </SkeletonRow>
            ))}
          </FileList>
        )}
      </Content>

      {/* Toast */}
      {toast && (
        <Toast>
          {toastLoading && <Spinner />}
          {toast}
        </Toast>
      )}
    </Page>
  );
}