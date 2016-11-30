using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(chapifarm.presentation.Startup))]
namespace chapifarm.presentation {
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
