import React, { useState, useEffect } from 'react';
import { t as translate } from '../i18n.js';

function Grid({ cols, rowCount, values, targetCell, mode, formulaValue, onFormulaChange, onCellClick }) {
  const rows = Array.from({ length: rowCount }, (_, i) => i + 1);
  return (
    <table className="sheet">
      <thead>
        <tr>
          <th></th>
          {cols.map(c => <th key={c}>{c}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr key={r}>
            <th>{r}</th>
            {cols.map(c => {
              const ref = c + r;
              if (mode === 'formula' && ref === targetCell) {
                return (
                  <td key={ref} className="sheet-cell target">
                    <input
                      className="formula-input"
                      value={formulaValue}
                      onChange={e => onFormulaChange(e.target.value)}
                      placeholder="="
                    />
                  </td>
                );
              }
              if (mode === 'click') {
                return (
                  <td key={ref}>
                    <button type="button" className="cell-btn" onClick={() => onCellClick(ref)}>
                      {values[ref] || ''}
                    </button>
                  </td>
                );
              }
              return <td key={ref} className="sheet-cell">{values[ref] || ''}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function LessonEngine({ lessonId, lang, req, onExit }) {
  const s = translate(lang);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taskIndex, setTaskIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [formula, setFormula] = useState('');
  const [optionId, setOptionId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [cRes, sRes] = await Promise.all([
        req(`/lessons/${lessonId}/content?lang=${lang}`),
        req(`/lessons/${lessonId}/session`),
      ]);
      const c = cRes.ok ? await cRes.json() : null;
      const sess = sRes.ok ? await sRes.json() : null;
      if (cancelled) return;
      setContent(c);
      if (sess && sess.state && typeof sess.state.taskIndex === 'number') setTaskIndex(sess.state.taskIndex);
      setAttempts(sess?.attempts || 0);
      setHintsUsed(sess?.hintsUsed || 0);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [lessonId, lang]);

  if (loading) return <section className="card"><p>{s.loadingLesson}</p></section>;
  if (!content) return <section className="card"><p>{s.lessonUnavailable}</p><button onClick={onExit}>{s.backToLibrary}</button></section>;

  const task = content.tasks[taskIndex];

  async function saveSession(nextIndex, nextAttempts, nextHints) {
    await req(`/lessons/${lessonId}/session`, {
      method: 'PUT',
      body: JSON.stringify({ state: { taskIndex: nextIndex }, attempts: nextAttempts, hintsUsed: nextHints }),
    });
  }

  function resetTaskUi() {
    setFeedback(null); setFormula(''); setOptionId(null); setShowHint(false); setAttempts(0); setHintsUsed(0);
  }

  async function handleResult(correct, currentAttempts) {
    if (correct) {
      setFeedback({ correct: true, msg: s.correct });
      const nextIndex = taskIndex + 1;
      await saveSession(nextIndex, 0, 0);
      setTimeout(async () => {
        resetTaskUi();
        if (nextIndex >= content.tasks.length) {
          await req(`/lessons/${lessonId}/complete`, { method: 'POST', body: JSON.stringify({ score: 100 }) });
          setFinished(true);
        } else {
          setTaskIndex(nextIndex);
        }
      }, 600);
    } else {
      setFeedback({ correct: false, msg: s.incorrect });
      await saveSession(taskIndex, currentAttempts, hintsUsed);
    }
  }

  async function submitFormula() {
    const body = { taskId: task.id, formula, attemptNo: attempts + 1 };
    const r = await req(`/lessons/${lessonId}/attempt`, { method: 'POST', body: JSON.stringify(body) });
    const d = await r.json();
    const currentAttempts = attempts + 1;
    setAttempts(currentAttempts);
    handleResult(d.correct, currentAttempts);
  }

  async function submitOption() {
    const body = { taskId: task.id, optionId, attemptNo: attempts + 1 };
    const r = await req(`/lessons/${lessonId}/attempt`, { method: 'POST', body: JSON.stringify(body) });
    const d = await r.json();
    const currentAttempts = attempts + 1;
    setAttempts(currentAttempts);
    handleResult(d.correct, currentAttempts);
  }

  async function clickCell(ref) {
    const body = { taskId: task.id, cell: ref, attemptNo: attempts + 1 };
    const r = await req(`/lessons/${lessonId}/attempt`, { method: 'POST', body: JSON.stringify(body) });
    const d = await r.json();
    const currentAttempts = attempts + 1;
    setAttempts(currentAttempts);
    handleResult(d.correct, currentAttempts);
  }

  function revealHint() {
    setShowHint(true);
    const n = hintsUsed + 1;
    setHintsUsed(n);
    saveSession(taskIndex, attempts, n);
  }

  if (finished) {
    return (
      <section className="card">
        <h2>{s.lessonComplete}</h2>
        <p>{s.lessonCompleteBody}</p>
        <button onClick={onExit}>{s.backToLibrary}</button>
      </section>
    );
  }

  if (!task) {
    return <section className="card"><p>{s.lessonUnavailable}</p><button onClick={onExit}>{s.backToLibrary}</button></section>;
  }

  return (
    <section>
      <p className="lesson-progress">{s.taskProgress(taskIndex + 1, content.tasks.length)}</p>
      <section className="card">
        <h2>{content.title}</h2>
        <p>{task.prompt}</p>

        {task.grid && (
          <Grid
            cols={task.grid.cols}
            rowCount={task.grid.rowCount}
            values={task.grid.values}
            targetCell={task.targetCell}
            mode={task.type === 'formula' ? 'formula' : task.type === 'click_cell' ? 'click' : 'display'}
            formulaValue={formula}
            onFormulaChange={setFormula}
            onCellClick={clickCell}
          />
        )}

        {task.type === 'multiple_choice' && (
          <div className="options">
            {task.options.map(o => (
              <button
                key={o.id}
                type="button"
                className={'option-btn' + (optionId === o.id ? ' selected' : '')}
                onClick={() => setOptionId(o.id)}
              >
                {o.text}
              </button>
            ))}
          </div>
        )}

        {feedback && <p className={feedback.correct ? 'feedback-ok' : 'feedback-bad'}>{feedback.msg}</p>}
        {showHint && <p className="hint">{s.hintLabel}: {task.hint}</p>}

        <div className="lesson-actions">
          {!showHint && <button type="button" className="secondary" onClick={revealHint}>{s.showHint}</button>}
          {task.type === 'formula' && (
            <button type="button" onClick={submitFormula} disabled={!formula}>{s.submit}</button>
          )}
          {task.type === 'multiple_choice' && (
            <button type="button" onClick={submitOption} disabled={!optionId}>{s.submit}</button>
          )}
          <button type="button" className="secondary" onClick={onExit}>{s.exitLesson}</button>
        </div>
      </section>
    </section>
  );
}
