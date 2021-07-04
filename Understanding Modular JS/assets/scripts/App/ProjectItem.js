// import { Tooltip } from './Tooltip.js'; //this method of importing is static
                                           //here file will be imported in the start
import { DOMHelper } from '../Utility/DOMHelper.js';

export class ProjectItem {
    hasActiveTooltip = false;
  
    constructor(id, updateProjectListsFunction, type) {
        this.id = id;
        this.updateProjectListsHandler = updateProjectListsFunction;
        this.connectMoreInfoButton();
        this.connectSwitchButton(type);
        this.connectDrag();
    }
  
    showMoreInfoHandler() {
        if (this.hasActiveTooltip) {
            return;
        }
        const projectElement = document.getElementById(this.id);
        const tooltipText = projectElement.dataset.extraInfo;
        import('./Tooltip.js').then(module => {  // this method of importing is dynamic so here file
            const tooltip = new module.Tooltip(() => { // will be imported only when required
                this.hasActiveTooltip = false;
            }, tooltipText, this.id);
            tooltip.attach();
            this.hasActiveTooltip = true;
        });
    }
  
    connectDrag(){
        document.getElementById(this.id).addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain',this.id);
            event.dataTransfer.effectAllowed = 'move';
        });
    }

    connectMoreInfoButton() {
        const projectItemElement = document.getElementById(this.id);
        const moreInfoBtn = projectItemElement.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click', this.showMoreInfoHandler.bind(this));
    }
  
    connectSwitchButton(type) {
        const projectItemElement = document.getElementById(this.id);
        let switchBtn = projectItemElement.querySelector('button:last-of-type');
        switchBtn = DOMHelper.clearEventListeners(switchBtn);
        switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchBtn.addEventListener('click', this.updateProjectListsHandler.bind(null, this.id) );
    }
  
    update(updateProjectListsFn, type) {
        this.updateProjectListsHandler = updateProjectListsFn;
        this.connectSwitchButton(type);
    }
}
