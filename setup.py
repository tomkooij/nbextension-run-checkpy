from setuptools import setup

try:
    from jupyterpip import cmdclass
except:
    import pip, importlib
    pip.main(['install', 'jupyter-pip'])
    cmdclass = importlib.import_module('jupyterpip').cmdclass

VERSION = '0.1'

setup(
    name                = 'nbextension-run-checkpy',
    version             = VERSION,
    install_requires    = ['jupyter-pip'],
    description         = """An extension of the Jupyter Notebook that runs checkPy.""",
    cmdclass            = cmdclass('run-checkpy', 'run-checkpy/run-checkpy.js'),
    author              = 'Tom Kooij',
    author_email        = 'tom.kooij@gmail.com',
	license             = 'MIT',
	keywords           =  'new unexperienced programmers automatic testing minor programming',
    classifiers         = ['Intended Audience :: Education',
		                   'Topic :: Education :: Testing',
		                   'License :: OSI Approved :: MIT License',
                           'Programming Language :: Python'],
    url                 = 'https://github.com/tomkooij/nbextension-run-checkpy',
    download_url        = 'https://github.com/tomkooij/nbextension-run-checkpy/archive/%s.zip' % VERSION,
)
