﻿// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the Apache License, Version 2.0. See License.txt in the project root for license information.

namespace Microsoft.AspNetCore.SignalR.Internal.Protocol
{
    public class NegotiationResponseMessage : HubMessage
    {
        public NegotiationResponseMessage(string error)
        {
            Error = error;
        }

        public string Error { get; }
    }
}
