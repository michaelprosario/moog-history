# To learn more about how to use Nix to configure your environment
# see: https://developers.google.com/idx/guides/customize-idx-env
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # default channel for this environment

  # Use packages list to install system tools
  packages = [
    # Reference the pre-built Node.js 20.19.6 from the Nix store
    /nix/store/9l5x7mywivx4khxxh895b7is6sy4vxpf-nodejs-20.19.6
  ];

  # Sets environment variables in the workspace
  env = {};

  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [];

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {};
      # Runs when the workspace is (re)started
      onStart = {};
    };
  };
}
