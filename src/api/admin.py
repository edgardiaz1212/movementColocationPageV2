  
import os
from flask_admin import Admin
from .models import db,DiagnosticoComponente, RegistroDiagnosticoAire, UserForm, Rack, Description, Equipment, TrackerUsuario, AireAcondicionado, Lectura, Mantenimiento, UmbralConfiguracion, OtroEquipo,Proveedor, ContactoProveedor, ActividadProveedor, DocumentoExterno, AuditLog 
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(UserForm, db.session))
    admin.add_view(ModelView(Rack, db.session))
    admin.add_view(ModelView(Equipment, db.session))
    admin.add_view(ModelView(Description, db.session))
    admin.add_view(ModelView(TrackerUsuario, db.session))
    admin.add_view(ModelView(AireAcondicionado, db.session))
    admin.add_view(ModelView(Lectura, db.session))
    admin.add_view(ModelView(Mantenimiento, db.session))
    admin.add_view(ModelView(UmbralConfiguracion, db.session))
    admin.add_view(ModelView(OtroEquipo, db.session))
    admin.add_view(ModelView(ContactoProveedor , db.session))
    admin.add_view(ModelView(Proveedor , db.session))
    admin.add_view(ModelView(ActividadProveedor , db.session))
    admin.add_view(ModelView(DocumentoExterno  , db.session))
    admin.add_view(ModelView(AuditLog  , db.session))
    admin.add_view(ModelView(DiagnosticoComponente, db.session))
    admin.add_view(ModelView(RegistroDiagnosticoAire, db.session))    

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))