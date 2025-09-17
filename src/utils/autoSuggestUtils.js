import mockData from '../data/mockData.json';

// Keywords that can trigger auto-suggestions for each data type
export const triggerKeywords = {
  form: ['form', 'forms', 'contact', 'registration', 'login', 'signup', 'survey'],
  variables: ['variable', 'variables', 'var', 'data', 'value', 'parameter'],
  page: ['page', 'pages', 'screen', 'route', 'navigation', 'dashboard', 'settings'],
  views: ['view', 'views', 'gallery', 'data view', 'form list', 'form grid', 'form display'],
  reports: ['report', 'reports', 'chart', 'analytics', 'tabular', 'data', 'summary']
};

/**
 * Find matching categories based on input text
 * @param {string} text - The input text to analyze
 * @returns {string[]} - Array of matching categories
 */
export function findMatchingCategories(text) {
  const lowerText = text.toLowerCase();
  const matches = [];

  Object.entries(triggerKeywords).forEach(([category, keywords]) => {
    const hasMatch = keywords.some(keyword => lowerText.includes(keyword));
    if (hasMatch) {
      matches.push(category);
    }
  });

  return matches;
}

/**
 * Get suggestions for matched categories from mockData
 * @param {string[]} categories - Array of category names
 * @param {string|null} selectedFormId - ID of selected form to filter views/reports
 * @returns {Object[]} - Array of suggestion objects with id and name
 */
export function getSuggestions(categories, selectedFormId = null) {
  const suggestions = [];
  
  categories.forEach(category => {
    if (category === 'form' && mockData.form) {
      mockData.form.forEach(item => {
        suggestions.push({
          id: item.formId,
          name: item.formName,
          type: 'form',
          category: 'form'
        });
      });
    }
    
    if (category === 'variables' && mockData.variables) {
      mockData.variables.forEach(item => {
        suggestions.push({
          id: item.variableId,
          name: item.variableName,
          type: 'variable',
          category: 'variables'
        });
      });
    }
    
    if (category === 'page' && mockData.page) {
      mockData.page.forEach(item => {
        suggestions.push({
          id: item.pageId,
          name: item.pageName,
          type: 'page',
          category: 'page'
        });
      });
    }
    
    if (category === 'views' && mockData.form) {
      mockData.form.forEach(form => {
        // If a form is selected, only show views from that form
        if (selectedFormId && form.formId !== selectedFormId) {
          return;
        }
        
        if (form.views && form.views.length > 0) {
          form.views.forEach(view => {
            suggestions.push({
              id: view.viewId,
              name: view.viewName,
              type: 'view',
              category: 'views',
              parentForm: form.formName,
              parentFormId: form.formId,
              viewType: view.viewType
            });
          });
        }
      });
    }
    
    if (category === 'reports' && mockData.form) {
      mockData.form.forEach(form => {
        // If a form is selected, only show reports from that form
        if (selectedFormId && form.formId !== selectedFormId) {
          return;
        }
        
        if (form.reports && form.reports.length > 0) {
          form.reports.forEach(report => {
            suggestions.push({
              id: report.reportId,
              name: report.reportName,
              type: 'report',
              category: 'reports',
              parentForm: form.formName,
              parentFormId: form.formId,
              reportType: report.reportType
            });
          });
        }
      });
    }
  });

  return suggestions;
}

/**
 * Extract selected form IDs from the text
 * @param {string} text - The input text
 * @returns {string|null} - The most recently selected form ID
 */
export function extractSelectedFormId(text) {
  const formNames = mockData.form.map(form => ({ name: form.formName, id: form.formId }));
  
  // Find the last occurrence of any form name in the text
  let lastFormId = null;
  let lastPosition = -1;
  
  formNames.forEach(({ name, id }) => {
    const position = text.lastIndexOf(name);
    if (position > lastPosition) {
      lastPosition = position;
      lastFormId = id;
    }
  });
  
  return lastFormId;
}

/**
 * Detect if user has typed a trigger pattern (keyword + space + /)
 * @param {string} text - Current input text
 * @param {number} cursorPosition - Current cursor position
 * @returns {Object|null} - Match information or null
 */
export function detectTriggerPattern(text, cursorPosition) {
  // Look for pattern: word + space + / at cursor position
  const beforeCursor = text.slice(0, cursorPosition);
  const triggerMatch = beforeCursor.match(/(\w+)\s\/$/);
  
  if (triggerMatch) {
    const keyword = triggerMatch[1];
    const categories = findMatchingCategories(keyword);
    
    if (categories.length > 0) {
      // Extract selected form ID for contextual filtering
      const selectedFormId = extractSelectedFormId(beforeCursor);
      
      return {
        keyword,
        categories,
        triggerPosition: beforeCursor.length - 1, // Position of the '/'
        selectedFormId,
        suggestions: getSuggestions(categories, selectedFormId)
      };
    }
  }
  
  return null;
}

/**
 * Replace the trigger pattern with selected suggestion
 * @param {string} text - Current input text
 * @param {number} triggerPosition - Position where trigger started
 * @param {string} selectedName - Selected suggestion name
 * @param {string} selectedId - Selected suggestion ID (for internal use)
 * @param {string} selectedType - Type of selected suggestion
 * @returns {Object} - New text and cursor position
 */
export function replaceTriggerWithSelection(text, triggerPosition, selectedName, selectedId, selectedType) {
  // Find the start of the trigger pattern (go back to find the word)
  let startPos = triggerPosition;
  while (startPos > 0 && text[startPos - 1] !== ' ') {
    startPos--;
  }
  
  // Replace from start of word to trigger position + 1 (to include the '/')
  const before = text.slice(0, startPos);
  const after = text.slice(triggerPosition + 1);
  const newText = before + selectedName + after;
  
  return {
    text: newText,
    cursorPosition: before.length + selectedName.length,
    selectedId, // Keep track of selected ID for internal use
    selectedType // Keep track of selected type
  };
}