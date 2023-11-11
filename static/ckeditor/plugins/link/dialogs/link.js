/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {
	CKEDITOR.dialog.add( 'link', function( editor ) {
		var plugin = CKEDITOR.plugins.link,	initialLinkText;

		function createRangeForLink( editor, link ) {
			var range = editor.createRange();

			range.setStartBefore( link );
			range.setEndAfter( link );

			return range;
		}

		function insertLinksIntoSelection( editor, data ) {
			var attributes = plugin.getLinkAttributes( editor, data ),
				ranges = editor.getSelection().getRanges(),
				style = new CKEDITOR.style( {
					element: 'a',
					attributes: attributes.set
				} ),
				rangesToSelect = [],
				range,
				text,
				nestedLinks,
				i,
				j;

			style.type = CKEDITOR.STYLE_INLINE; // need to override... dunno why.

			for ( i = 0; i < ranges.length; i++ ) {
				range = ranges[ i ];

				// Use link URL as text with a collapsed cursor.
				if ( range.collapsed ) {
					// Short mailto link text view (https://dev.ckeditor.com/ticket/5736).
					text = new CKEDITOR.dom.text( data.linkText || ( data.type === 'email' ?
						data.email.address : attributes.set[ 'data-cke-saved-href' ] ), editor.document );
					range.insertNode( text );
					range.selectNodeContents( text );
				} else if ( initialLinkText !== data.linkText ) {
					text = new CKEDITOR.dom.text( data.linkText, editor.document );

					// Shrink range to preserve block element.
					range.shrink( CKEDITOR.SHRINK_TEXT );

					// Use extractHtmlFromRange to remove markup within the selection. Also this method is a little
					// smarter than range#deleteContents as it plays better e.g. with table cells.
					editor.editable().extractHtmlFromRange( range );

					range.insertNode( text );
				}

				// Editable links nested within current range should be removed, so that the link is applied to whole selection.
				nestedLinks = range._find( 'a' );

				for	( j = 0; j < nestedLinks.length; j++ ) {
					nestedLinks[ j ].remove( true );
				}


				// Apply style.
				style.applyToRange( range, editor );

				rangesToSelect.push( range );
			}

			editor.getSelection().selectRanges( rangesToSelect );
		}

		function editLinksInSelection( editor, selectedElements, data ) {
			var attributes = plugin.getLinkAttributes( editor, data ),
				ranges = [],
				element,
				href,
				textView,
				newText,
				i;

			for ( i = 0; i < selectedElements.length; i++ ) {
				// We're only editing an existing link, so just overwrite the attributes.
				element = selectedElements[ i ];
				href = element.data( 'cke-saved-href' );
				textView = element.getHtml();

				element.setAttributes( attributes.set );
				element.removeAttributes( attributes.removed );


				if ( data.linkText && initialLinkText !== data.linkText ) {
					// Display text has been changed.
					newText = data.linkText;
				} else if ( href === textView || data.type === 'email' && textView.indexOf( '@' ) !== -1 ) {
					// Update text view when user changes protocol (https://dev.ckeditor.com/ticket/4612).
					// Short mailto link text view (https://dev.ckeditor.com/ticket/5736).
					newText = data.type === 'email' ? data.email.address : attributes.set[ 'data-cke-saved-href' ];
				}

				if ( newText ) {
					element.setText( newText );
				}

				ranges.push( createRangeForLink( editor, element ) );
			}

			// We changed the content, so need to select it again.
			editor.getSelection().selectRanges( ranges );
		}

		var setupParams = function( page, data ) {
				if ( data[ page ] )
					this.setValue( data[ page ][ this.id ] || '' );
			};

		var setupPopupParams = function( data ) {
				return setupParams.call( this, 'target', data );
			};

		var setupAdvParams = function( data ) {
				return setupParams.call( this, 'advanced', data );
			};

		var commitParams = function( page, data ) {
				if ( !data[ page ] )
					data[ page ] = {};

				data[ page ][ this.id ] = this.getValue() || '';
			};

		var commitPopupParams = function( data ) {
				//return commitParams.call( this, 'target', data );
            return true;
			};

		var commitAdvParams = function( data ) {
				//return commitParams.call( this, 'advanced', data );
            return true;
			};

		var commonLang = editor.lang.common,
			linkLang = editor.lang.link,
			anchors;

		return {
			title: linkLang.title,
			minWidth: ( CKEDITOR.skinName || editor.config.skin ) === 'moono-lisa' ? 450 : 350,
			minHeight: 200,
			contents: [ {
				id: 'info',
				label: '連結',
				title: linkLang.info,
				elements: [ {
					type: 'text',
					id: 'linkDisplayText',
					label: '顯示文字',
					setup: function() {
						this.enable();

                        // 從editor中取得反白的文字
                        this.setValue( editor.getSelection().getSelectedText() );

						// 我們將此值存在initialLinkText
						initialLinkText = this.getValue();
					},
					commit: function( data ) {
						data.linkText = this.isEnabled() ? this.getValue() : '';
					}
				},
				{
					id: 'linkType',
					type: 'select',
					label: '連結類型',
					'default': 'url',
					items: [
						[ linkLang.toUrl, 'url' ],
					],
					//onChange: linkTypeChanged,
					setup: function( data ) {
                        this.setValue(data.type || 'url');
                        this.getElement().hide();
					},
					commit: function( data ) {
						data.type = this.getValue();
					}
				},
				{
					type: 'vbox',
					id: 'urlOptions',
					children: [ {
						type: 'hbox',
						widths: [ '25%', '75%' ],
						children: [ {
							id: 'protocol',
							type: 'select',
							label: '通信協定',
							'default': 'http://',
							items: [
								// Force 'ltr' for protocol names in BIDI. (https://dev.ckeditor.com/ticket/5433)
								[ 'http://\u200E', 'http://' ],
                                [ 'https://\u200E', 'https://' ],
                                [ '', '']
							],
							setup: function( data ) {
								if ( data.url )
									this.setValue( data.url.protocol || '' );
							},
							commit: function( data ) {
								if ( !data.url )
									data.url = {};

								data.url.protocol = this.getValue();
							}
						},
						{
							type: 'text',
							id: 'url',
							label: 'Url',
							onLoad: function() {
								this.allowOnChange = true;
							},
							validate: function() {
								var dialog = this.getDialog();

								if ( dialog.getContentElement( 'info', 'linkType' ) && dialog.getValueOf( 'info', 'linkType' ) !== 'url' )
									return true;

								if ( !editor.config.linkJavaScriptLinksAllowed && ( /javascript\:/ ).test( this.getValue() ) ) {
									//alert( commonLang.invalidValue ); // jshint ignore:line
									return false;
								}

								if ( this.getDialog().fakeObj ) // Edit Anchor.
								return true;

                                var mylinkdocument = this.getElement().getDocument();
                                var mylinkelement = mylinkdocument.getById('linkDiv');

                                if (!this.getValue()) {
                                    if (mylinkelement) {
                                        mylinkelement.setHtml('<div id="linkDiv" style="color: red; font: bold 16px important;">請輸入Url</div>');
                                    }
                                    return false;
                                } else {
                                    if (mylinkelement) {
                                        mylinkelement.setHtml('<div id="linkDiv"></div>');
                                    }
                                }
							},
							setup: function( data ) {
								this.allowOnChange = false;
								if ( data.url )
									this.setValue( data.url.url );
								this.allowOnChange = true;

							},
							commit: function( data ) {
								// IE will not trigger the onChange event if the mouse has been used
								// to carry all the operations https://dev.ckeditor.com/ticket/4724
								//this.onChange();

								if ( !data.url )
									data.url = {};

								data.url.url = this.getValue();
								this.allowOnChange = false;
							}
						} ],
						setup: function() {
							if ( !this.getDialog().getContentElement( 'info', 'linkType' ) )
								this.getElement().show();
						}
					}]
                },
                {
                    id: 'warning',
                    type: 'html',
                    html: '<div id="linkDiv"></div>'
                }]
			}
			],
			onShow: function() {
				var editor = this.getParentEditor(),
					selection = editor.getSelection(),
					displayTextField = this.getContentElement( 'info', 'linkDisplayText' ).getElement().getParent().getParent(),
					elements = plugin.getSelectedLink( editor, true ),
					firstLink = elements[ 0 ] || null;

				// Fill in all the relevant fields if there's already one link selected.
				if ( firstLink && firstLink.hasAttribute( 'href' ) ) {
					// Don't change selection if some element is already selected.
					// For example - don't destroy fake selection.
					if ( !selection.getSelectedElement() && !selection.isInTable() ) {
						selection.selectElement( firstLink );
					}
				}

				var data = plugin.parseLinkAttributes( editor, firstLink );

				// Here we'll decide whether or not we want to show Display Text field.
				if ( elements.length <= 1 && plugin.showDisplayTextForElement( firstLink, editor ) ) {
					displayTextField.show();
				} else {
					displayTextField.hide();
				}

				// Record down the selected element in the dialog.
				this._.selectedElements = elements;

				this.setupContent( data );
			},
            onOk: function () {
				var data = {};

				// Collect data from fields.
				this.commitContent( data );

				if ( !this._.selectedElements.length ) {
					insertLinksIntoSelection( editor, data );
				} else {
					editLinksInSelection( editor, this._.selectedElements, data );

					delete this._.selectedElements;
				}
            },
            onCancel: function () {
                var mydocument = this.getElement().getDocument();
                var myelement = mydocument.getById('linkDiv');
                if (myelement) {
                    myelement.setHtml('<div id="linkDiv"></div>');
                }
                return true;
            },
			onLoad: function() {
			},
			// Inital focus on 'url' field if link is of type URL.
			onFocus: function() {
				var linkType = this.getContentElement( 'info', 'linkType' ),
					urlField;

				if ( linkType && linkType.getValue() === 'url' ) {
					urlField = this.getContentElement( 'info', 'url' );
					urlField.select();
				}
			}
		};
	} );
} )();
