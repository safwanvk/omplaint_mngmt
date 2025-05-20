from django.shortcuts import render
from django.utils.decorators import method_decorator
from django.shortcuts import redirect
from .decorators import render_method
from django.views import View
from django.utils.translation import gettext_lazy as _
from .forms import (UserLoginForm, AddNewEmployeeForm, UserProfileForm, AddNewCompliantForm,
                    EditComplaintForm, WorkflowComplaintForm)
from .utilities import afl_reverse
from django.conf import settings

# Create your views here.
@method_decorator(render_method(), name='dispatch')
class Home(View):

	def get(self, request, *args, **kwargs):
		return redirect('login_url')

@method_decorator(render_method(), name='dispatch')
class UserLoginView(View):
	template = 'frontend/login.html'

	def get(self, request, *args, **kwargs):
		render_context = {}
		if request.user.is_authenticated:
			return redirect('dashboard')
		form = UserLoginForm(request=request)
		context = {
                  'form': form,
                  'next': request.GET.get('next'),
                  'title' : _("Login"),
		}
		render_context['context'] = context
		render_context['return_type'] = 'template_response'
		render_context['template'] = self.template
		return render_context


@method_decorator(render_method(), name='dispatch')
class AflDasboardView(View):
	template_name = 'frontend/user/dashboard.html'
	context = {}
	def get(self, request, *args, **kwargs):
		render_context = {}
		self.context = {}

		# Dashboard Widget visibility settings
		self.context['settings'] = settings
		context = {'template' : self.template_name, 'context':self.context, 'return_type' : 'template_response'}
		return context

@method_decorator(render_method(), name='dispatch')
class ManageStaff(View):
	template_name = 'frontend/user/manage-staff.html'

	def get(self, request, *args, **kwargs):
		context = self.get_context_data(request,*args, **kwargs)
		context['page_object'] = context
		context['theme_group'] = 'backoffice'
		render_context = {}
		render_context['context'] = context
		render_context['return_type'] = 'template_response'
		render_context['template'] = self.template_name
		return render_context

	def get_context_data(self,request, *args, **kwargs):
		headers = {
			'pk': _("User id"),
			'full_name': _('Full name'),
			'email': _('Email'),
			'created': _('Joined date'),
			'title' : _("Title"),
		}
		context = {}

		context['table_values'] = {}
		context['table_title']    = {'title' : _("Manage Staff"), 'icon' : '<i class="la la-users text-primary"></i>'}


		bulk_actions = {}
		context['bulk_actions'] = bulk_actions
		filters = {}
		context['filter'] = filters
		headers['actions'] = _("Actions")
		context['edit_any_user'] = True


		context['header_btn'] 		= {'url' : 'add_employee', 'label': _('Add New Employee'), 'class': 'bi bi-plus mr-1'}

		# if not settings.DEBUG:
		# 	del headers['pk']

		context['users_role'] = 'staff'
		context['show_username'] = True
		context['not_sortable'] = ['role', 'full_name','actions','username','full_name','email', 'pk', 'created', 'groups__name']

		page_filter = {}
		page_filter['username'] = {'label' : _('Name'), 'type' : 'autocomplete','autocomplete_url':'user-dowline-autocomplete'}

		# context['page_filter'] = page_filter
		context['page_filter_btn'] = _('Find')
		context['page_reset_btn'] = _('Reset')

		context['headers'] = headers
		context['paginations'] = range(10)
		context['label'] = _("Manage Employee")
		context['action_url'] = "bulk_processing"
		context['breadcrumbs'] = {
                            0: {
                                'icon': "bi bi-house",
                                'url' : 'dashboard'
                            },
                        }
		return context

@method_decorator(render_method(), name='dispatch')
class AddNewEmployee(View):
	template = 'frontend/user/add-new-staff.html'
	def get(self, request, *args, **kwargs):
		context = {}
		initial = {}
		initial['request'] = request
		form = AddNewEmployeeForm(initial=initial)
		form.id = "register-form"
		context['form'] = form
		context['theme_group'] = 'backoffice'
		render_context = {}
		render_context['context'] = context
		render_context['return_type'] = 'template_response'
		render_context['template'] = self.template
		return render_context


import copy
@method_decorator(render_method(), name='dispatch')
class AflManageMemberEdit(View):
	template = 'frontend/user/manage_member_edit.html'

	def prepare_breadcrumbs(self,request,context,role):
		is_redirect = request.GET.get('redirect',False)
		if not is_redirect:
			if role:
				is_redirect = True
		previous = False
		if is_redirect:
			previous = request.GET.get('from',None)
			if not previous:
				if role == "staff":
					previous = 'manage_staffs'

		if previous and not previous == None:
			if previous == 'manage_staffs':
				context['label'] = _('Edit Employee Account Info')
				context['breadcrumbs'].update({
					1:{
						'label':_('Manage Employee'),
						'url'  : 'manage_staff'
					}
				})
		return context

	def get(self, request, *args, **kwargs):
		form_kwargs = {
		}
		request_instance = copy.copy(request)
		form = UserProfileForm(request=request_instance,**form_kwargs)
		context = {}

		button =[
			{'type':"submit",'label':_("Save changes"),'name':"personal_details",'class':"btn btn-brand",},
			{'type':"reset",'label':_("Cancel"),'class':"btn btn-secondary",},
		]
		form.buttons = button
		context['form'] = form

		role = request.GET.get('role', "staff")
		context['role'] = role
		staff_id = request.GET.get('staff_id', None)
		context['staff_id'] = staff_id
		context['theme_group'] = 'backoffice'
		context['manage_staff'] = afl_reverse('manage_staff', request)
		# context['label'] = _('Edit Member Account Info')
		context['breadcrumbs'] = {
				0: {
                                'icon': "bi bi-house",
                                'url' : 'dashboard'
                            },

				}
		context = self.prepare_breadcrumbs(request,context,role)
		render_context = {}
		render_context['context'] = context
		render_context['return_type'] = 'template_response'
		render_context['template'] = self.template
		return render_context

@method_decorator(render_method(), name='dispatch')
class ManageComplaint(View):
	template_name = 'frontend/compliant/manage-complaint.html'

	def get(self, request, *args, **kwargs):
		context = self.get_context_data(request,*args, **kwargs)
		context['page_object'] = context
		context['theme_group'] = 'backoffice'
		render_context = {}
		render_context['context'] = context
		render_context['return_type'] = 'template_response'
		render_context['template'] = self.template_name
		return render_context

	def get_context_data(self,request, *args, **kwargs):
		headers = {
			'pk': _("Complaint id"),
			'title': _('Title'),
			'assignee': _('Assignee'),
			'status' : _("Status"),
			'createdAt' : _("Created date"),
		}
		context = {}

		context['table_values'] = {}
		context['table_title']    = {'title' : _("Manage Complaint"), 'icon' : '<i class="la la-users text-primary"></i>'}


		bulk_actions = {}
		context['bulk_actions'] = bulk_actions
		filters = {}
		context['filter'] = filters
		headers['actions'] = _("Actions")
		context['edit_any_user'] = True
		context['is_staff'] = 'false'
		if request.user.is_staff:
			context['header_btn'] 		= {'url' : 'add_complaint', 'label': _('Add New Complaint'), 'class': 'bi bi-plus mr-1', 'withOutSlider': True}
			context['is_staff'] = 'true'

		# if not settings.DEBUG:
		# 	del headers['pk']

		context['users_role'] = 'staff'
		context['show_username'] = True
		context['not_sortable'] = ['role', 'full_name','actions','username','full_name','email', 'pk', 'created', 'groups__name']

		page_filter = {}
		page_filter['username'] = {'label' : _('Name'), 'type' : 'autocomplete','autocomplete_url':'user-dowline-autocomplete'}

		# context['page_filter'] = page_filter
		context['page_filter_btn'] = _('Find')
		context['page_reset_btn'] = _('Reset')

		context['headers'] = headers
		context['paginations'] = range(10)
		context['label'] = _("Manage Complaint")
		context['action_url'] = "bulk_processing"
		context['breadcrumbs'] = {
                            0: {
                                'icon': "bi bi-house",
                                'url' : 'dashboard'
                            },
                        }
		return context

@method_decorator(render_method(), name='dispatch')
class AddNewComplaint(View):
	template = 'frontend/compliant/add-new-complaint.html'

	def prepare_breadcrumbs(self,request,context,role):
		is_redirect = request.GET.get('redirect',False)
		if not is_redirect:
			if role:
				is_redirect = True
		previous = False
		if is_redirect:
			previous = request.GET.get('from',None)
			if not previous:
				if role == "complaint":
					previous = 'manage_complaint'

		if previous and not previous == None:
			if previous == 'manage_complaint':
				context['label'] = _('Add New Complaint')
				context['breadcrumbs'].update({
					1:{
						'label':_('Manage Complaint'),
						'url'  : 'manage_complaint'
					}
				})
		return context

	def get(self, request, *args, **kwargs):
		context = {}
		initial = {}
		initial['request'] = request
		form = AddNewCompliantForm(initial=initial)
		context = {}

		button =[
			{'type':"submit",'label':_("Save changes"),'name':"personal_details",'class':"btn btn-brand",},
			{'type':"reset",'label':_("Cancel"),'class':"btn btn-secondary",},
		]
		form.buttons = button
		context['form'] = form

		role = request.GET.get('role', "complaint")
		context['theme_group'] = 'backoffice'
		context['manage_complaint'] = afl_reverse('manage_complaint', request)
		context['breadcrumbs'] = {
				0: {
                                'icon': "bi bi-house",
                                'url' : 'dashboard'
                            },

				}
		context = self.prepare_breadcrumbs(request,context,role)
		render_context = {}
		render_context['context'] = context
		render_context['return_type'] = 'template_response'
		render_context['template'] = self.template
		return render_context

@method_decorator(render_method(), name='dispatch')
class AflManageComplaintsEdit(View):
	template = 'frontend/compliant/manage_complaint_edit.html'

	def prepare_breadcrumbs(self,request,context,role):
		is_redirect = request.GET.get('redirect',False)
		if not is_redirect:
			if role:
				is_redirect = True
		previous = False
		if is_redirect:
			previous = request.GET.get('from',None)
			if not previous:
				if role == "complaint":
					previous = 'manage_compliant'

		if previous and not previous == None:
			if previous == 'manage_compliant':
				context['label'] = _('Edit Complaint Info')
				context['breadcrumbs'].update({
					1:{
						'label':_('Manage Complaint'),
						'url'  : 'manage_complaint'
					}
				})
		return context

	def get(self, request, *args, **kwargs):
		form_kwargs = {
		}
		request_instance = copy.copy(request)
		form = EditComplaintForm(request=request_instance,**form_kwargs)
		context = {}

		button =[
			{'type':"submit",'label':_("Save changes"),'name':"personal_details",'class':"btn btn-brand",},
			{'type':"reset",'label':_("Cancel"),'class':"btn btn-secondary",},
		]
		form.buttons = button
		context['form'] = form

		role = request.GET.get('role', "complaint")
		context['role'] = role
		complaint_id = request.GET.get('complaint_id', None)
		context['complaint_id'] = complaint_id
		context['theme_group'] = 'backoffice'
		context['manage_complaints'] = afl_reverse('manage_complaint', request)
		# context['label'] = _('Edit Member Account Info')
		context['breadcrumbs'] = {
				0: {
                                'icon': "bi bi-house",
                                'url' : 'dashboard'
                            },

				}
		context = self.prepare_breadcrumbs(request,context,role)
		render_context = {}
		render_context['context'] = context
		render_context['return_type'] = 'template_response'
		render_context['template'] = self.template
		return render_context

@method_decorator(render_method(), name='dispatch')
class ComplaintView(View):
	template = 'frontend/compliant/complaint-view.html'

	def prepare_breadcrumbs(self,request,context):
		is_redirect = request.GET.get('redirect',False)
		if not is_redirect:
			is_redirect = True
		previous = False
		if is_redirect:
			previous = request.GET.get('from',None)
			if not previous:
				previous = 'manage_compliant'

		if previous and not previous == None:
			if previous == 'manage_compliant':
				context['label'] = _('Complaint Info')
				context['breadcrumbs'].update({
					1:{
						'label':_('Complaints'),
						'url'  : 'manage_complaint'
					}
				})
		return context

	def get(self, request, *args, **kwargs):
		context = {}
		compliant_id = request.GET.get('compliant_id', None)
		context['compliant_id'] = compliant_id
		general_fields = [
      		{
                'key': 'title',
                'text': _('Title'),
            },
      		{
                'key': 'description',
                'text': _('Description'),
            },
			{
                'key': 'assignee_name',
                'text': _('Assignee'),
            },
		{
                'key': 'status_display',
                'text': _('Status'),
            },
  {
                'key': 'status_remark',
                'text': _('Remark'),
            },
		{
                'key': 'status_update_date',
                'text': _('Workflow date'),
            },
	 {
                'key': 'status_update_ip',
                'text': _('Workflow ip'),
            },
      		{
                'key': 'createdAt',
                'text': _('Created'),
            },
		{
			'key': 'updatedAt',
			'text': _("Updated")
		}
        ]
		context['general_fields'] = general_fields
		context['theme_group'] = 'backoffice'
		previous = request.GET.get('from',None)
		if not previous:
			previous = 'manage_complaint'
		context['previous'] = previous
		context['breadcrumbs'] = {
				0: {
					'icon': "bi bi-house",
					'url' : 'dashboard'
                },

				}
		context = self.prepare_breadcrumbs(request,context)
		render_context = {}
		render_context['context'] = context
		render_context['return_type'] = 'template_response'
		render_context['template'] = self.template
		return render_context

@method_decorator(render_method(), name='dispatch')
class AflManageComplaintsWorkflow(View):
	template = 'frontend/compliant/manage_complaint_workflow.html'

	def prepare_breadcrumbs(self,request,context,role):
		is_redirect = request.GET.get('redirect',False)
		if not is_redirect:
			if role:
				is_redirect = True
		previous = False
		if is_redirect:
			previous = request.GET.get('from',None)
			if not previous:
				if role == "workflow":
					previous = 'manage_compliant'

		if previous and not previous == None:
			if previous == 'manage_compliant':
				context['label'] = _('Edit Complaint Info')
				context['breadcrumbs'].update({
					1:{
						'label':_('Manage Complaint'),
						'url'  : 'manage_complaint'
					}
				})
		return context

	def get(self, request, *args, **kwargs):
		form_kwargs = {
		}
		request_instance = copy.copy(request)
		form = WorkflowComplaintForm(request=request_instance,**form_kwargs)
		context = {}

		button =[
			{'type':"submit",'label':_("Save changes"),'name':"personal_details",'class':"btn btn-brand",},
			{'type':"reset",'label':_("Cancel"),'class':"btn btn-secondary",},
		]
		form.buttons = button
		context['form'] = form

		role = request.GET.get('role', "workflow")
		context['role'] = role
		complaint_id = request.GET.get('complaint_id', None)
		context['complaint_id'] = complaint_id
		context['theme_group'] = 'backoffice'
		context['manage_complaints'] = afl_reverse('manage_complaint', request)
		# context['label'] = _('Edit Member Account Info')
		context['breadcrumbs'] = {
				0: {
                                'icon': "bi bi-house",
                                'url' : 'dashboard'
                            },

				}
		context = self.prepare_breadcrumbs(request,context,role)
		render_context = {}
		render_context['context'] = context
		render_context['return_type'] = 'template_response'
		render_context['template'] = self.template
		return render_context