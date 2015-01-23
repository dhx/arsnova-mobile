/*
 * This file is part of ARSnova Mobile.
 * Copyright (C) 2011-2012 Christian Thomas Weber
 * Copyright (C) 2012-2014 The ARSnova Team
 *
 * ARSnova Mobile is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * ARSnova Mobile is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with ARSnova Mobile.  If not, see <http://www.gnu.org/licenses/>.
 */
Ext.define('ARSnova.view.home.PublicPoolSingleItemPanel', {
	extend: 'Ext.Panel',

	config: {
		backRef: null,
		fullscreen: true,
		scrollable: {
			direction: 'vertical',
			directionLock: true
		},
		session: null
	},

	constructor: function (args) {
		this.callParent(arguments);

		var me = this;
		
		//
		// Toolbar items
		//
		
		this.backButton = Ext.create('Ext.Button', {
			text: Messages.BACK,
			ui: 'back',
			scope: this,
			handler: function () {
				me.getBack();
			}
		});
		
		this.exportButton = Ext.create('Ext.Button', {
			text: Messages.SESSIONPOOL_CLONE,
			ui: 'confirm',
			cls: 'saveQuestionButton',
			style: 'width: 89px',
			handler: function () {
				var customSessionAttributes = {};
				customSessionAttributes['name'] = me.sessionName.getValue();
				customSessionAttributes['shortName'] = me.sessionShortName.getValue();
				ARSnova.app.getController("SessionExport").cloneSessionFromPublicPool(me.getSession(), customSessionAttributes);
			},
			scope: this
		});

		this.visitButton = Ext.create('Ext.Button', {
			text: Messages.SESSIONPOOL_VISIT,
			ui: 'confirm',
			cls: 'saveQuestionButton',
			style: 'width: 89px',
			sessionObj: this.getSession(),
			handler: function (options) {
				var hideLoadMask = ARSnova.app.showLoadMask(Messages.LOAD_MASK_LOGIN);
				ARSnova.app.getController('Auth').roleSelect({
					mode: ARSnova.app.USER_ROLE_STUDENT
				});
				ARSnova.app.getController('Sessions').login({
					keyword: options.config.sessionObj.keyword
				});
				hideLoadMask();
			},
			scope: this
		});
		
		this.toolbar = Ext.create('Ext.Toolbar', {
			title: this.getSession().name,
			docked: 'top',
			ui: 'light',
			items: [
				this.backButton,
				{xtype:'spacer'},
				(ARSnova.app.userRole === ARSnova.app.USER_ROLE_STUDENT) ? this.visitButton : this.exportButton 
			]
		});


		this.sessionName = Ext.create('Ext.field.Text', {
			label: Messages.SESSION_NAME,
			name: 'sessionName',
			value: this.getSession().name,
			disabledCls: 'disableDefault',
			inputCls: 'thm-grey',
			maxLength : 50,
			disabled: false
		});
		
		this.sessionShortName = Ext.create('Ext.field.Text', {
			label: Messages.SESSION_SHORT_NAME,
			name: 'sessionShortName',
			value: this.getSession().shortName,
			disabledCls: 'disableDefault',
			inputCls: 'thm-grey',
			maxLength : 8,
			disabled: false
		});

		this.markdownPanel = Ext.create('ARSnova.view.MathJaxMarkDownPanel', {
			xtype: 'mathJaxMarkDownPanel',
			id: 'questionContent',
			style: 'background-color: transparent; color: black; '
		});

		this.markdownPanel.setContent( this.getSession().ppDescription, true, true);	 
		
		// panel for question subject
		this.titlePanel = Ext.create('ARSnova.view.MathJaxMarkDownPanel', {
			xtype: 'mathJaxMarkDownPanel',
			id: 'questionTitle',
			style: 'background-color: transparent; padding: 0;font-weight: bold; font-size: 1.4em;'
		});
		this.titlePanel.setContent('Beschreibung', false, true);	
		
		this.singleTemplatePanel = Ext.create('Ext.Panel',{	
			
			layout:	{
				type: 'vbox',
				pack: 'center',
				align: 'center' 
			},
			 items:[ this.titlePanel,
			         this.markdownPanel
			      ]
		});
		
/*		this.sessionDescription = Ext.create('Ext.plugins.ResizableTextArea', {
			label: Messages.SESSIONPOOL_INFO,
			name: 'sessionDescription',
			//value: this.markdownPanel,
			disabledCls: 'disableDefault',
			inputCls: 'thm-grey',
			disabled: true,
			item: [this.markdownPanel]
		});
*/
//		this.sessionQuestionCount = Ext.create('Ext.field.Text', {
//			label: Messages.SESSIONPOOL_COUNT_QUESTION,
//			name: 'sessionQuestionCount',
//			value: this.getQuestionCount(),
//			disabledCls: 'disableDefault',
//			inputCls: 'thm-grey',
//			disabled: true
//		});
		
		this.sessionLicense = Ext.create('Ext.field.Text', {
			label: Messages.EXPORT_FIELD_LICENCE,
			name: 'sessionLicense',
			value: this.getSession().ppLicense,
			disabledCls: 'disableDefault',
			inputCls: 'thm-grey',
			disabled: true
		});
		
		this.sessionFieldSet = Ext.create('Ext.form.FieldSet', {
			title: Messages.SESSIONPOOL_SESSIONINFO,
			cls: 'standardFieldset',
			itemId: 'contentFieldset',
			items: [this.sessionName, this.sessionShortName, /*this.sessionDescription,*/ /*this.sessionQuestionCount,*/ this.sessionLicense]
		});
		
		//
		// Create Creator Fieldset
		//
		
		this.creatorName = Ext.create('Ext.field.Text', {
			label: Messages.EXPORT_FIELD_NAME,
			name: 'creatorName',
			value: this.getSession().ppAuthorName,
			disabledCls: 'disableDefault',
			inputCls: 'thm-grey',
			disabled: true
		});
		
		this.creatorMail = Ext.create('Ext.field.Text', {
			label: Messages.EXPORT_FIELD_EMAIL,
			name: 'creatorMail',
			value: this.getSession().ppAuthorMail,
			disabledCls: 'disableDefault',
			inputCls: 'thm-grey',
			disabled: true
		});
		
		this.creatorUni = Ext.create('Ext.field.Text', {
			label: Messages.EXPORT_FIELD_UNI,
			name: 'creatorUni',
			value: this.getSession().ppUniversity,
			disabledCls: 'disableDefault',
			inputCls: 'thm-grey',
			disabled: true
		});
		
		this.creatorDep = Ext.create('Ext.field.Text', {
			label: Messages.EXPORT_FIELD_SPECIAL_FIELD,
			name: 'creatorDep',
			value: this.getSession().ppFaculty,
			disabledCls: 'disableDefault',
			inputCls: 'thm-grey',
			disabled: true
		});
		
		this.creatorFieldSet = Ext.create('Ext.form.FieldSet', {
			title: Messages.SESSIONPOOL_AUTHORINFO,
			cls: 'standardFieldset',
			itemId: 'contentFieldset',
			items: [this.creatorName, this.creatorMail, this.creatorUni, this.creatorDep]
		});
		
		this.contentForm = Ext.create('Ext.form.FormPanel', {
			scrollable: null,
			itemId: 'contentForm',
			items: [
			        this.singleTemplatePanel,
			        this.sessionFieldSet,
			        this.creatorFieldSet
			]
		});

		if (this.getSession().ppLogo != null) {
			this.logoFieldSet = Ext.create('Ext.form.FieldSet', {
				cls: 'standardFieldset',
				itemId: 'contentFieldset',
				items: [
				        Ext.create('Ext.Img', { 
				        	mode:'img', // not background 
				        	style: {
				        		'margin': '0px auto',
				        	},
				        	width: 100,
				        	src:this.getSession().ppLogo
				        })]
			});
			this.contentForm.add(this.logoFieldSet);
		}
		
		this.add([
			this.toolbar,
			this.contentForm
		]);
	},
	
	getBack: function() {
		var hTP = ARSnova.app.mainTabPanel.tabPanel.homeTabPanel;

		hTP.animateActiveItem(this.getBackRef(), {
			type: 'slide',
			direction: 'right',
			duration: 700
		});
	}
});