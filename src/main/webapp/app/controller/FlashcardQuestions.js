/*
 * This file is part of ARSnova Mobile.
 * Copyright (C) 2011-2012 Christian Thomas Weber
 * Copyright (C) 2012-2016 The ARSnova Team
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
Ext.define("ARSnova.controller.FlashcardQuestions", {
	extend: 'ARSnova.controller.Questions',

	requires: ['ARSnova.model.Question'],

	config: {
		models: ['ARSnova.model.Question']
	},

	flip: false,

	listQuestions: function () {
		var sTP = ARSnova.app.mainTabPanel.tabPanel.speakerTabPanel;
		sTP.newQuestionPanel.setVariant('flashcard');
		sTP.audienceQuestionPanel.setVariant('flashcard');
		sTP.audienceQuestionPanel.setController(this);
		sTP.showcaseQuestionPanel.setController(this);
		sTP.animateActiveItem(sTP.audienceQuestionPanel, 'slide');
	},

	flashcardIndex: function (options) {
		ARSnova.app.mainTabPanel.tabPanel.userQuestionsPanel.setFlashcardMode();
		ARSnova.app.mainTabPanel.tabPanel.userQuestionsPanel.toolbar.setTitle(Messages.FLASHCARDS);
		if (options && options.renew) {
			ARSnova.app.mainTabPanel.tabPanel.userQuestionsPanel.renew(options.ids);
		}
		ARSnova.app.mainTabPanel.tabPanel.animateActiveItem(ARSnova.app.mainTabPanel.tabPanel.userQuestionsPanel, 'slide');
	},

	destroyAll: function () {
		var question = Ext.create('ARSnova.model.Question');
		question.deleteAllFlashcards.apply(question, arguments);
	},

	deleteAllQuestionsAnswers: function (callbacks) {
		var question = Ext.create('ARSnova.model.Question');
		question.deleteAllFlashcardViews(sessionStorage.getItem("keyword"), callbacks);
	},

	getQuestions: function () {
		ARSnova.app.questionModel.getFlashcards.apply(ARSnova.app.questionModel, arguments);
	},

	flipFlashcards: function (flip) {
		this.flip = flip;
		this.flipAllFlashcards(flip);
	},

	flipAllFlashcards: function (flip) {
		var tabPanel, carousel;

		if (ARSnova.app.userRole === ARSnova.app.USER_ROLE_SPEAKER) {
			tabPanel = ARSnova.app.mainTabPanel.tabPanel.speakerTabPanel;
			carousel = tabPanel.showcaseQuestionPanel;
			tabPanel.audienceQuestionPanel.flipFlashcardsButton.config.flip();
		} else {
			tabPanel = ARSnova.app.mainTabPanel.tabPanel.userTabPanel;
			carousel = tabPanel.userQuestionsPanel;
		}

		if (tabPanel.getActiveItem() === carousel &&
			carousel.getMode() === 'flashcard') {
			carousel.getInnerItems().forEach(function (flashcard) {
				if (flashcard.questionObj.questionType === 'flashcard') {
					flashcard.questionContainer.isFlipped = flip;
					if (flip) {
						flashcard.questionContainer.addCls('flipped');
						flashcard.flashcardToggleButton.setText(
							Messages.HIDE_FLASHCARD_ANSWER);

						if (flashcard.editButtons) {
							flashcard.editButtons.flipFlashcardsButton
								.element.down('.iconBtnImg').replaceCls(
								'icon-flashcard-front', 'icon-flashcard-back');
						}
					} else {
						flashcard.questionContainer.removeCls('flipped');
						flashcard.flashcardToggleButton.setText(
							Messages.SHOW_FLASHCARD_ANSWER);

						if (flashcard.editButtons) {
							flashcard.editButtons.flipFlashcardsButton
								.element.down('.iconBtnImg').replaceCls(
								'icon-flashcard-back', 'icon-flashcard-front');
						}
					}
				}
			});
		}
	},

	adHoc: function () {
		var sTP = ARSnova.app.mainTabPanel.tabPanel.speakerTabPanel;
		sTP.sortQuestionsPanel.setController(this);
		sTP.audienceQuestionPanel.setController(this);
		sTP.showcaseQuestionPanel.setController(this);
		sTP.audienceQuestionPanel.setVariant('flashcard');
		sTP.newQuestionPanel.setVariant('flashcard');
		sTP.animateActiveItem(sTP.newQuestionPanel, {
			type: 'slide',
			duration: 700
		});

		/* change the backButton-redirection to inClassPanel,
		 * but only for one function call */
		var backButton = sTP.newQuestionPanel.down('button[ui=back]');
		backButton.setHandler(function () {
			var sTP = ARSnova.app.mainTabPanel.tabPanel.speakerTabPanel;
			sTP.animateActiveItem(sTP.inClassPanel, {
				type: 'slide',
				direction: 'right',
				duration: 700
			});
		});
		backButton.setText(Messages.SESSION);
		sTP.newQuestionPanel.on('deactivate', function (panel) {
			panel.backButton.handler = function () {
				var sTP = ARSnova.app.mainTabPanel.tabPanel.speakerTabPanel;
				sTP.animateActiveItem(sTP.audienceQuestionPanel, {
					type: 'slide',
					direction: 'right',
					duration: 700
				});
			};
			panel.backButton.setText(Messages.TASKS);
		}, this, {single: true});
	}
});
