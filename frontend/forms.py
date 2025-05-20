from django import forms
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class UserLoginForm(forms.Form):
	email = forms.CharField(label=_('Email'),max_length=250,widget=forms.TextInput(attrs={'class':'form-control','placeholder':'Email'}))
	password = forms.CharField(label=_('Password'),max_length=250,widget=forms.TextInput(attrs={'class':'form-control','placeholder':'Password'}))
	def __init__(self, *args, **kwargs):
		self.request = None
		if 'request' in kwargs:
			self.request = kwargs.pop('request', None)
		kwargs.setdefault('label_suffix', '')
		super(UserLoginForm, self).__init__(*args, **kwargs)

class AflAbstractUserForm(forms.Form):
	first_name = forms.CharField(max_length=20,label=_('First Name'))
	last_name = forms.CharField(max_length=20, label=_('Last Name'))
	email = forms.CharField(max_length=50, label=_('Email'))
	phone_number = forms.CharField(max_length=10, label=_('Phone Number'))
	title = forms.CharField(max_length=120, label=_('Title'))

	def __init__(self, *args, **kwargs):
		# pp("AflAbstractUserForm---------------")
		# Get 'initial' argument if any	
		initial_arguments = kwargs.get('initial', None)
		if not hasattr(self,'request') or not self.request:
			if initial_arguments:
				self.request = initial_arguments.get('request',None)
			else:
				self.request = None

		super(AflAbstractUserForm, self).__init__(*args, **kwargs)
		self.fields['last_name'].label = _('Last Name')
		self.fields['email'].label = _('Email address')
		self.fields['phone_number'].label = _('Phone Number')
		self.fields['title'].label = _('Title')

class UserCreationForm(AflAbstractUserForm):
	"""A form for creating new users. Includes all the required
	fields, plus a repeated password."""
	password = forms.CharField(label=_('Password'), widget=forms.TextInput(attrs={'class':'form-control','placeholder':_('Password')}))
	confirmpswd = forms.CharField(label=_('Password confirmation'), widget=forms.TextInput(attrs={'class':'form-control','placeholder':_('Password')}))
 
class AddNewEmployeeForm(UserCreationForm):
	"""docstring for AddNewStaffForm"""

	def __init__(self, *args, **kwargs):
		super(AddNewEmployeeForm, self).__init__(*args, **kwargs)


		if 'password' in self.fields:
			self.fields['password'].widget.attrs.update({
				'autocomplete': 'off',
				'disabled':True          #for preventing autocomplete some browser where above line not working such as Chrome
			})
		if 'confirmpswd' in self.fields:
			self.fields['confirmpswd'].widget.attrs.update({
				'autocomplete': 'off',
				'disabled':True			#for preventing autocomplete some browser where above line not working such as Chrome
			})
		self.fields['password'].label = _("Password")
		self.fields['confirmpswd'].label = _("Password confirmation")

class UserProfileForm(AflAbstractUserForm):

	def __init__(self, *args, **kwargs):
		self.request = kwargs.pop('request', None)
		super().__init__(*args, **kwargs)

class AddNewCompliantForm(forms.Form):
	options = (
		('', _('Please select')),
	)
	title = forms.CharField(label=_("Title"), required=True)
	description = forms.CharField(label=_("Description"), required=True, widget=forms.Textarea(attrs={'rows': 4, 'cols': 25}))
	assignee = forms.ChoiceField(
        choices=[
            ('', _('Please select'))
        ],
        label=_("Assignee"),
        widget=forms.Select(attrs={
            'class': 'form-control',
            'data-placeholder': _('Choose assignee'),
            'data-url': f'{settings.SERVER_URL}/api/v1/assignee-autocomplete/'
        })
    	)

	def __init__(self, *args, **kwargs):
		self.request = None
		if 'request' in kwargs:
			self.request = kwargs.pop('request', None)
		super(AddNewCompliantForm, self).__init__(*args, **kwargs)
		instance = kwargs.get('instance',{})

class EditComplaintForm(forms.Form):
	options = (
		('', _('Please select')),
	)
	title = forms.CharField(label=_("Title"), required=True)
	description = forms.CharField(label=_("Description"), required=True, widget=forms.Textarea(attrs={'rows': 4, 'cols': 25}))
	assignee = forms.ChoiceField(
        choices=[
            ('', _('Please select'))
        ],
        label=_("Assignee"),
        widget=forms.Select(attrs={
            'class': 'form-control',
            'data-placeholder': _('Choose assignee'),
            'data-url': f'{settings.SERVER_URL}/api/v1/assignee-autocomplete/'
        })
    	)

	def __init__(self, *args, **kwargs):
		self.request = None
		if 'request' in kwargs:
			self.request = kwargs.pop('request', None)
		super(EditComplaintForm, self).__init__(*args, **kwargs)
		instance = kwargs.get('instance',{})

class WorkflowComplaintForm(forms.Form):
	STATUS_CHOICES=[
		('new','New'),
		('triaged','Triaged'),
		('in_progress','In progress'),
		('resolved','Resolved'),
		('closed','Closed')
	]
	status = forms.ChoiceField(choices=STATUS_CHOICES, label=_('Status'), widget=forms.Select(), required=True)
	status_remark = forms.CharField(label=_("Remark"), required=True, widget=forms.Textarea(attrs={'rows': 4, 'cols': 25}))

	def __init__(self, *args, **kwargs):
		self.request = None
		if 'request' in kwargs:
			self.request = kwargs.pop('request', None)
		super(WorkflowComplaintForm, self).__init__(*args, **kwargs)
		instance = kwargs.get('instance',{})