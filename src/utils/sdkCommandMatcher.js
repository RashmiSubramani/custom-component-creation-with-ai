import mockData from '../data/mockData.json';

// SDK Commands organized by functionality
export const sdkCommands = {
  // Initialization
  init: {
    pattern: ['initialize', 'setup', 'init'],
    command: 'KFSDK.initialize()',
    description: 'Initialize the SDK',
    usage: 'const kf = await KFSDK.initialize();'
  },

  // App Variables
  appVariables: {
    get: {
      pattern: ['get variable', 'retrieve variable', 'fetch variable', 'app variable'],
      command: 'kf.app.getVariable(variableId)',
      description: 'Get app variable value',
      usage: 'const value = await kf.app.getVariable("{variableId}");',
      dynamicParams: ['variableId']
    },
    set: {
      pattern: ['set variable', 'update variable', 'change variable'],
      command: 'kf.app.setVariable(variableId, value)',
      description: 'Set app variable value',
      usage: 'await kf.app.setVariable("{variableId}", value);',
      dynamicParams: ['variableId']
    }
  },

  // Page Operations
  page: {
    open: {
      pattern: ['open page', 'navigate page', 'go to page', 'navigate to'],
      command: 'kf.app.openPage(pageId, params)',
      description: 'Navigate to a page',
      usage: 'await kf.app.openPage("{pageId}", { inputParam1: "value1" });',
      dynamicParams: ['pageId']
    },
    getVariable: {
      pattern: ['get page variable', 'page variable', 'local variable'],
      command: 'kf.app.page.getVariable(variableId)',
      description: 'Get page local variable',
      usage: 'const value = await kf.app.page.getVariable("{variableId}");',
      dynamicParams: ['variableId']
    },
    setVariable: {
      pattern: ['set page variable', 'update page variable'],
      command: 'kf.app.page.setVariable(variableId, value)',
      description: 'Set page local variable',
      usage: 'await kf.app.page.setVariable("{variableId}", value);',
      dynamicParams: ['variableId']
    }
  },

  // Form Operations (Dataform)
  form: {
    get: {
      pattern: ['get form', 'fetch form', 'retrieve form', 'form data', 'form item', 'display form', 'show form', 'form details', 'form information'],
      command: 'kf.api("/form/2/{accountId}/formId/instanceId")',
      description: 'Get form data',
      usage: 'const formData = await kf.api("/form/2/" + kf.account._id + "/{formId}/{instanceId}");',
      dynamicParams: ['formId', 'instanceId']
    },
    list: {
      pattern: ['list form', 'form list', 'all forms', 'form entries', 'form table', 'display form entries'],
      command: 'kf.api("/form/2/{accountId}/formId/list")',
      description: 'Get all form entries for table/list display',
      usage: 'const formList = await kf.api("/form/2/" + kf.account._id + "/{formId}/list");',
      dynamicParams: ['formId']
    },
    create: {
      pattern: ['create form', 'new form', 'add form', 'submit form'],
      command: 'kf.api("/form/2/{accountId}/formId/", { method: "POST", body: JSON.stringify(payload) })',
      description: 'Create new form item',
      usage: 'const result = await kf.api("/form/2/" + kf.account._id + "/{formId}/", { method: "POST", body: JSON.stringify(payload) });',
      dynamicParams: ['formId']
    },
    update: {
      pattern: ['update form', 'edit form', 'modify form'],
      command: 'kf.api("/form/2/{accountId}/formId/instanceId", { method: "POST", body: JSON.stringify(payload) })',
      description: 'Update form item',
      usage: 'const result = await kf.api("/form/2/" + kf.account._id + "/{formId}/{instanceId}", { method: "POST", body: JSON.stringify(payload) });',
      dynamicParams: ['formId', 'instanceId']
    },
    delete: {
      pattern: ['delete form', 'remove form'],
      command: 'kf.api("/form/2/{accountId}/formId/instanceId", { method: "DELETE" })',
      description: 'Delete form item',
      usage: 'const result = await kf.api("/form/2/" + kf.account._id + "/{formId}/{instanceId}", { method: "DELETE" });',
      dynamicParams: ['formId', 'instanceId']
    }
  },

  // Component Operations
  component: {
    get: {
      pattern: ['get component', 'component instance'],
      command: 'kf.app.page.getComponent(componentId)',
      description: 'Get component instance',
      usage: 'const component = kf.app.page.getComponent("{componentId}");',
      dynamicParams: ['componentId']
    },
    refresh: {
      pattern: ['refresh component', 'reload component'],
      command: 'componentInstance.refresh()',
      description: 'Refresh component',
      usage: 'component.refresh();'
    },
    hide: {
      pattern: ['hide component'],
      command: 'componentInstance.hide()',
      description: 'Hide component',
      usage: 'component.hide();'
    },
    show: {
      pattern: ['show component', 'display component'],
      command: 'componentInstance.show()',
      description: 'Show component',
      usage: 'component.show();'
    }
  },

  // UI Messages
  ui: {
    showInfo: {
      pattern: ['show message', 'display message', 'info message', 'notify'],
      command: 'kf.client.showInfo(message)',
      description: 'Show info message',
      usage: 'kf.client.showInfo("Your message here");'
    }
  },

  // Reports/Views (custom logic)
  reports: {
    get: {
      pattern: ['get report', 'fetch report', 'report data'],
      command: 'kf.api("/form/2/{accountId}/formId/reports/{reportId}")',
      description: 'Get report data',
      usage: 'const reportData = await kf.api("/form/2/" + kf.account._id + "/{formId}/reports/{reportId}");',
      dynamicParams: ['formId', 'reportId']
    }
  },

  views: {
    get: {
      pattern: ['get view', 'fetch view', 'view data'],
      command: 'kf.api("/form/2/{accountId}/formId/views/{viewId}")',
      description: 'Get view data',
      usage: 'const viewData = await kf.api("/form/2/" + kf.account._id + "/{formId}/views/{viewId}");',
      dynamicParams: ['formId', 'viewId']
    }
  }
};

/**
 * Match user prompt with SDK commands
 * @param {string} prompt - User's prompt
 * @returns {Object[]} - Array of matched commands
 */
export function matchSDKCommands(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  const matches = [];

  function searchInCategory(category, categoryName) {
    if (typeof category === 'object' && category.pattern) {
      // Direct command
      const hasMatch = category.pattern.some(pattern => lowerPrompt.includes(pattern));
      if (hasMatch) {
        matches.push({
          category: categoryName,
          ...category,
          confidence: 0.8
        });
      }
    } else {
      // Nested commands
      Object.entries(category).forEach(([subCommand, details]) => {
        if (details.pattern) {
          const hasMatch = details.pattern.some(pattern => lowerPrompt.includes(pattern));
          if (hasMatch) {
            // Higher confidence for more specific matches
            let confidence = 0.7;
            
            // Boost confidence for table/list + form combinations
            if (categoryName === 'form' && subCommand === 'list' && 
                (lowerPrompt.includes('table') || lowerPrompt.includes('display'))) {
              confidence = 0.9;
            }
            
            // Boost confidence for form data retrieval
            if (categoryName === 'form' && subCommand === 'get' && 
                (lowerPrompt.includes('details') || lowerPrompt.includes('show'))) {
              confidence = 0.85;
            }
            
            matches.push({
              category: categoryName,
              subCommand,
              ...details,
              confidence
            });
          }
        }
      });
    }
  }

  Object.entries(sdkCommands).forEach(([category, commands]) => {
    searchInCategory(commands, category);
  });

  return matches.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Extract entity IDs from selected suggestions in prompt
 * @param {string} prompt - User's prompt
 * @param {Object[]} selectedSuggestions - Array of selected suggestions
 * @returns {Object} - Mapping of entity types to IDs
 */
export function extractEntityIds(prompt, selectedSuggestions = []) {
  const entityIds = {};

  // Extract from selected suggestions
  selectedSuggestions.forEach(suggestion => {
    switch (suggestion.type) {
      case 'form':
        entityIds.formId = suggestion.id;
        break;
      case 'variable':
        entityIds.variableId = suggestion.id;
        break;
      case 'page':
        entityIds.pageId = suggestion.id;
        break;
      case 'view':
        entityIds.viewId = suggestion.id;
        if (suggestion.parentFormId) {
          entityIds.formId = suggestion.parentFormId;
        }
        break;
      case 'report':
        entityIds.reportId = suggestion.id;
        if (suggestion.parentFormId) {
          entityIds.formId = suggestion.parentFormId;
        }
        break;
    }
  });

  // Fallback: Extract from mockData by matching names in prompt
  if (Object.keys(entityIds).length === 0) {
    const lowerPrompt = prompt.toLowerCase();
    
    // Check forms
    mockData.form?.forEach(form => {
      if (lowerPrompt.includes(form.formName.toLowerCase())) {
        entityIds.formId = form.formId;
        
        // Check views within this form
        form.views?.forEach(view => {
          if (lowerPrompt.includes(view.viewName.toLowerCase())) {
            entityIds.viewId = view.viewId;
          }
        });
        
        // Check reports within this form
        form.reports?.forEach(report => {
          if (lowerPrompt.includes(report.reportName.toLowerCase())) {
            entityIds.reportId = report.reportId;
          }
        });
      }
    });

    // Check variables
    mockData.variables?.forEach(variable => {
      if (lowerPrompt.includes(variable.variableName.toLowerCase())) {
        entityIds.variableId = variable.variableId;
      }
    });

    // Check pages
    mockData.page?.forEach(page => {
      if (lowerPrompt.includes(page.pageName.toLowerCase())) {
        entityIds.pageId = page.pageId;
      }
    });
  }

  return entityIds;
}

/**
 * Replace dynamic parameters in SDK command usage
 * @param {string} usage - SDK command usage template
 * @param {Object} entityIds - Mapping of entity types to IDs
 * @returns {string} - Usage with replaced parameters
 */
export function replaceDynamicParams(usage, entityIds) {
  let replacedUsage = usage;

  // Replace dynamic parameters
  Object.entries(entityIds).forEach(([paramType, id]) => {
    const placeholder = `{${paramType}}`;
    replacedUsage = replacedUsage.replace(new RegExp(placeholder, 'g'), id);
  });

  return replacedUsage;
}

/**
 * Generate SDK-enhanced prompt for LLM
 * @param {string} originalPrompt - Original user prompt
 * @param {Object[]} selectedSuggestions - Selected auto-suggestions
 * @returns {Object} - Enhanced prompt with SDK commands
 */
/**
 * Analyze prompt to determine which form API operation is needed
 * @param {string} prompt - User's prompt
 * @param {Object} suggestion - Selected form suggestion
 * @returns {string} - API operation type (get, list, create, update, delete)
 */
function determineFormAPIOperation(prompt, suggestion) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Be more specific - only return create if explicitly asking for form creation/submission
  if ((lowerPrompt.includes('create') || lowerPrompt.includes('add') || 
       lowerPrompt.includes('new') || lowerPrompt.includes('submit')) &&
      (lowerPrompt.includes('form') || lowerPrompt.includes('entry') || lowerPrompt.includes('record'))) {
    return 'create';
  }
  
  // Update/Edit operations - must be explicitly requested
  if ((lowerPrompt.includes('update') || lowerPrompt.includes('edit') || 
       lowerPrompt.includes('modify') || lowerPrompt.includes('change')) &&
      (lowerPrompt.includes('form') || lowerPrompt.includes('entry') || lowerPrompt.includes('record'))) {
    return 'update';
  }
  
  // Delete operations - must be explicitly requested
  if ((lowerPrompt.includes('delete') || lowerPrompt.includes('remove')) &&
      (lowerPrompt.includes('form') || lowerPrompt.includes('entry') || lowerPrompt.includes('record'))) {
    return 'delete';
  }
  
  // Single record display - must explicitly ask for details/specific record
  if (lowerPrompt.includes('detail') || lowerPrompt.includes('specific') ||
      lowerPrompt.includes('individual') || lowerPrompt.includes('single')) {
    return 'get';
  }
  
  // Default to list for table/display requests
  return 'list';
}

/**
 * Generate SDK commands based on selected suggestions and prompt context
 * @param {string} prompt - User's prompt for context
 * @param {Object[]} selectedSuggestions - Array of selected suggestions
 * @returns {Object[]} - Array of SDK command objects
 */
function generateCommandsFromSuggestions(prompt, selectedSuggestions = []) {
  const commands = [];
  
  selectedSuggestions.forEach(suggestion => {
    switch (suggestion.type) {
      case 'form':
        const operation = determineFormAPIOperation(prompt, suggestion);
        const formCommand = sdkCommands.form[operation];
        
        if (formCommand) {
          commands.push({
            category: 'form',
            subCommand: operation,
            pattern: formCommand.pattern,
            command: formCommand.command,
            description: `${formCommand.description} for ${suggestion.name}`,
            usage: formCommand.usage.replace('{formId}', suggestion.id),
            dynamicParams: formCommand.dynamicParams
          });
        }
        break;
        
      case 'view':
        commands.push({
          category: 'views',
          subCommand: 'get',
          pattern: ['get view'],
          command: 'kf.api("/form/2/{accountId}/formId/views/{viewId}")',
          description: `Get data from ${suggestion.name} view`,
          usage: `const viewData = await kf.api("/form/2/" + kf.account._id + "/${suggestion.parentFormId || 'formId'}/views/${suggestion.id}");`,
          dynamicParams: ['formId', 'viewId']
        });
        break;
        
      case 'variable':
        commands.push({
          category: 'appVariables',
          subCommand: 'get',
          pattern: ['get variable'],
          command: 'kf.app.getVariable(variableId)',
          description: `Get ${suggestion.name} variable value`,
          usage: `const value = await kf.app.getVariable("${suggestion.id}");`,
          dynamicParams: ['variableId']
        });
        break;
    }
  });
  
  return commands;
}

export function generateSDKEnhancedPrompt(originalPrompt, selectedSuggestions = []) {
  const matchedCommands = matchSDKCommands(originalPrompt);
  const entityIds = extractEntityIds(originalPrompt, selectedSuggestions);
  
  // Generate commands based on selected suggestions with prompt context
  const suggestedCommands = generateCommandsFromSuggestions(originalPrompt, selectedSuggestions);
  
  // Combine both matched and suggested commands
  const allCommands = [...matchedCommands, ...suggestedCommands];

  if (allCommands.length === 0) {
    return {
      originalPrompt,
      hasSDKCommands: false,
      commands: [],
      entityIds
    };
  }

  // Prepare SDK commands with replaced parameters
  const enhancedCommands = allCommands.map(command => ({
    ...command,
    enhancedUsage: command.usage ? replaceDynamicParams(command.usage, entityIds) : command.usage
  }));

  return {
    originalPrompt,
    hasSDKCommands: true,
    commands: enhancedCommands,
    entityIds,
    enhancedPrompt: `${originalPrompt}\n\n--- SDK INTEGRATION ---\nIMPORTANT: Use ONLY the following Kissflow SDK commands. DO NOT add any other operations:\n\n${enhancedCommands.map(cmd => `• ${cmd.description}: \`${cmd.enhancedUsage}\``).join('\n')}\n\nRequirements:\n1. Initialize the SDK: \`const kf = await KFSDK.initialize();\`\n2. Use ONLY the exact command syntax provided above\n3. Handle async operations properly\n4. Include proper error handling\n5. DO NOT add create, update, delete or any other operations not specified\n6. Focus ONLY on the operation requested by the user`
  };
}